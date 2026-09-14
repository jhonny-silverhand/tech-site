/**
 * Parse iBlessi PC Builder Parts dataset and output SQL for Supabase
 * Source: https://github.com/iBlessi/pc-builder-parts (CC BY 4.0)
 * Attribution: TechFuelHQ PC Builder Parts Dataset
 */

import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('D:/work/tech-site/Guides/pc-builder-parts.json', 'utf-8'));

console.log('Parsing PC components...');
console.log('Categories:', Object.keys(data).filter(k => !k.startsWith('_') && k !== 'performance_tiers'));

const components = [];

// Parse CPUs
if (data.cpu) {
  for (const cpu of data.cpu) {
    components.push({
      id: cpu.id,
      category: 'cpu',
      vendor: cpu.vendor,
      model: cpu.model,
      specs: {
        cores: cpu.cores,
        threads: cpu.threads,
        boost_ghz: cpu.boost_ghz,
        tdp_w: cpu.tdp_w,
        socket: cpu.socket,
        ram_type: cpu.ram_type,
        supported_chipsets: cpu.supported_chipsets,
      },
      performance_tier: cpu.performance_tier,
      use_cases: cpu.use_cases,
      notes: cpu.notes,
      source_url: cpu.source || null,
      last_verified: cpu.last_verified,
    });
  }
}

// Parse GPUs
if (data.gpu) {
  for (const gpu of data.gpu) {
    components.push({
      id: gpu.id,
      category: 'gpu',
      vendor: gpu.vendor,
      model: gpu.model,
      specs: {
        vram_gb: gpu.vram_gb,
        tgp_w: gpu.tgp_w,
        length_mm: gpu.length_mm,
        pcie: gpu.pcie,
      },
      performance_tier: gpu.performance_tier,
      use_cases: gpu.use_cases,
      notes: gpu.notes,
      source_url: gpu.source || null,
      last_verified: gpu.last_verified,
    });
  }
}

// Parse Motherboards
if (data.motherboard) {
  for (const mb of data.motherboard) {
    components.push({
      id: mb.id,
      category: 'motherboard',
      vendor: mb.vendor,
      model: mb.model,
      specs: {
        socket: mb.socket,
        chipset: mb.chipset,
        form_factor: mb.form_factor,
        ram_type: mb.ram_type,
        ram_slots: mb.ram_slots,
        ram_max_gb: mb.ram_max_gb,
        m2_slots: mb.m2_slots,
        pcie_gen: mb.pcie_gen,
      },
      performance_tier: null,
      use_cases: mb.use_cases,
      notes: mb.notes,
      source_url: mb.source || null,
      last_verified: mb.last_verified,
    });
  }
}

// Parse RAM
if (data.ram) {
  for (const ram of data.ram) {
    components.push({
      id: ram.id,
      category: 'ram',
      vendor: ram.vendor,
      model: ram.model,
      specs: {
        capacity_gb: ram.capacity_gb,
        speed_mhz: ram.speed_mhz,
        cas_latency: ram.cas_latency,
        ram_type: ram.ram_type,
        modules: ram.modules,
        voltage: ram.voltage,
      },
      performance_tier: ram.performance_tier,
      use_cases: ram.use_cases,
      notes: ram.notes,
      source_url: ram.source || null,
      last_verified: ram.last_verified,
    });
  }
}

// Parse Storage
if (data.storage) {
  for (const storage of data.storage) {
    components.push({
      id: storage.id,
      category: 'storage',
      vendor: storage.vendor,
      model: storage.model,
      specs: {
        capacity_gb: storage.capacity_gb,
        interface: storage.interface, // NVMe Gen5, Gen4, SATA
        read_mbps: storage.read_mbps,
        write_mbps: storage.write_mbps,
        form_factor: storage.form_factor,
        endurance_tbw: storage.endurance_tbw,
      },
      performance_tier: storage.performance_tier,
      use_cases: storage.use_cases,
      notes: storage.notes,
      source_url: storage.source || null,
      last_verified: storage.last_verified,
    });
  }
}

// Parse PSUs
if (data.psu) {
  for (const psu of data.psu) {
    components.push({
      id: psu.id,
      category: 'psu',
      vendor: psu.vendor,
      model: psu.model,
      specs: {
        wattage: psu.wattage,
        efficiency: psu.efficiency, // 80+ Bronze, Gold, etc.
        modular: psu.modular,
        form_factor: psu.form_factor,
        fan_size: psu.fan_size,
      },
      performance_tier: null,
      use_cases: psu.use_cases,
      notes: psu.notes,
      source_url: psu.source || null,
      last_verified: psu.last_verified,
    });
  }
}

// Parse Cases
if (data.case) {
  for (const pcCase of data.case) {
    components.push({
      id: pcCase.id,
      category: 'case',
      vendor: pcCase.vendor,
      model: pcCase.model,
      specs: {
        form_factor: pcCase.form_factor,
        max_gpu_length_mm: pcCase.max_gpu_length_mm,
        max_cpu_cooler_height_mm: pcCase.max_cpu_cooler_height_mm,
        drive_bays: pcCase.drive_bays,
        expansion_slots: pcCase.expansion_slots,
        front_panel: pcCase.front_panel,
      },
      performance_tier: null,
      use_cases: pcCase.use_cases,
      notes: pcCase.notes,
      source_url: pcCase.source || null,
      last_verified: pcCase.last_verified,
    });
  }
}

console.log(`Total components: ${components.length}`);

// Helper to convert array to PostgreSQL array literal
function toPGArray(arr) {
  if (!arr || arr.length === 0) return 'NULL';
  const escaped = arr.map(v => v.replace(/"/g, '""'));
  return `'{${escaped.join(',')}}'`;
}

// Generate SQL insert statements
const sql = `-- PC Components from iBlessi dataset (CC BY 4.0)
-- Attribution: TechFuelHQ PC Builder Parts Dataset (https://techfuelhq.com/tools/pc-builder/)
-- Generated: ${new Date().toISOString()}

INSERT INTO pc_components (id, category, vendor, model, specs, performance_tier, use_cases, notes, source_url, last_verified) VALUES
${components.map(c => `(
  '${c.id}',
  '${c.category}',
  '${c.vendor.replace(/'/g, "''")}',
  '${c.model.replace(/'/g, "''")}',
  '${JSON.stringify(c.specs).replace(/'/g, "''")}',
  ${c.performance_tier ? `'${c.performance_tier}'` : 'NULL'},
  ${toPGArray(c.use_cases)},
  '${(c.notes || '').replace(/'/g, "''")}',
  ${c.source_url ? `'${c.source_url}'` : 'NULL'},
  '${c.last_verified}'
)`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  specs = EXCLUDED.specs,
  performance_tier = EXCLUDED.performance_tier,
  use_cases = EXCLUDED.use_cases,
  notes = EXCLUDED.notes,
  last_verified = EXCLUDED.last_verified;
`;

writeFileSync('D:/work/tech-site/Guides/sql/pc-components.sql', sql);
console.log('SQL written to Guides/sql/pc-components.sql');

// Also output summary
const summary = {};
for (const c of components) {
  summary[c.category] = (summary[c.category] || 0) + 1;
}
console.log('Summary:', summary);
