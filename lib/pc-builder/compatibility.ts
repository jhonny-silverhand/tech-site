/**
 * PC Component Compatibility Engine
 * Validates whether components are compatible with each other
 * Based on iBlessi dataset rules (CC BY 4.0)
 */

export interface PCComponent {
  id: string;
  category: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case';
  vendor: string;
  model: string;
  specs: Record<string, any>;
  performance_tier?: string;
  use_cases?: string[];
  notes?: string;
}

export interface CompatibilityResult {
  compatible: boolean;
  issues: CompatibilityIssue[];
  warnings: CompatibilityWarning[];
}

export interface CompatibilityIssue {
  type: string;
  severity: 'error';
  message: string;
  from_component?: string;
  to_component?: string;
}

export interface CompatibilityWarning {
  type: string;
  severity: 'warning';
  message: string;
  from_component?: string;
  to_component?: string;
}

/**
 * Form factor hierarchy (larger contains smaller)
 */
const FORM_FACTOR_HIERARCHY: Record<string, number> = {
  'Mini-ITX': 0,
  'Micro-ATX': 1,
  'ATX': 2,
  'E-ATX': 3,
  'SSI CEB': 3,
  'EEB': 4,
};

/**
 * Check if CPU is compatible with motherboard
 */
function checkCPUMotherboard(cpu: PCComponent, motherboard: PCComponent): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const warnings: CompatibilityWarning[] = [];
  
  // Socket check
  if (cpu.specs.socket !== motherboard.specs.socket) {
    issues.push({
      type: 'socket_mismatch',
      severity: 'error',
      message: `CPU socket ${cpu.specs.socket} is not compatible with motherboard socket ${motherboard.specs.socket}`,
      from_component: cpu.id,
      to_component: motherboard.id,
    });
  }
  
  // Chipset check
  const supportedChipsets = cpu.specs.supported_chipsets || [];
  if (!supportedChipsets.includes(motherboard.specs.chipset)) {
    issues.push({
      type: 'chipset_incompatible',
      severity: 'error',
      message: `Motherboard chipset ${motherboard.specs.chipset} is not supported by ${cpu.model}. Supported: ${supportedChipsets.join(', ')}`,
      from_component: cpu.id,
      to_component: motherboard.id,
    });
  }
  
  return { compatible: issues.length === 0, issues, warnings };
}

/**
 * Check if RAM is compatible with motherboard
 */
function checkRAMMotherboard(ram: PCComponent, motherboard: PCComponent): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const warnings: CompatibilityWarning[] = [];
  
  // RAM type check (DDR4 vs DDR5)
  if (ram.specs.ram_type !== motherboard.specs.ram_type) {
    issues.push({
      type: 'ram_type_mismatch',
      severity: 'error',
      message: `RAM type ${ram.specs.ram_type} is not compatible with motherboard ${motherboard.specs.ram_type} slots`,
      from_component: ram.id,
      to_component: motherboard.id,
    });
  }
  
  // Capacity check
  const totalRamGB = ram.specs.capacity_gb || 0;
  const maxRamGB = motherboard.specs.ram_max_gb || 128;
  if (totalRamGB > maxRamGB) {
    issues.push({
      type: 'ram_capacity_exceeded',
      severity: 'error',
      message: `RAM capacity ${totalRamGB}GB exceeds motherboard maximum ${maxRamGB}GB`,
      from_component: ram.id,
      to_component: motherboard.id,
    });
  }
  
  // Module count check
  const modules = ram.specs.modules || 1;
  const slots = motherboard.specs.ram_slots || 2;
  if (modules > slots) {
    issues.push({
      type: 'ram_slots_exceeded',
      severity: 'error',
      message: `RAM has ${modules} modules but motherboard only has ${slots} slots`,
      from_component: ram.id,
      to_component: motherboard.id,
    });
  }
  
  return { compatible: issues.length === 0, issues, warnings };
}

/**
 * Check if PSU has enough wattage for CPU + GPU
 */
function checkPSUWattage(psu: PCComponent, cpu?: PCComponent, gpu?: PCComponent): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const warnings: CompatibilityWarning[] = [];
  
  const psuWattage = psu.specs.wattage || 0;
  const cpuTDP = cpu?.specs.tdp_w || 0;
  const gpuTGP = gpu?.specs.tgp_w || 0;
  
  // Required wattage: CPU TDP + GPU TGP + 150W system overhead
  const requiredWattage = cpuTDP + gpuTGP + 150;
  const withMargin = requiredWattage * 1.2; // 20% margin
  
  if (psuWattage < requiredWattage) {
    issues.push({
      type: 'psu_insufficient',
      severity: 'error',
      message: `PSU ${psuWattage}W is insufficient. Required: ${requiredWattage}W (CPU: ${cpuTDP}W + GPU: ${gpuTGP}W + 150W overhead)`,
      from_component: psu.id,
    });
  } else if (psuWattage < withMargin) {
    warnings.push({
      type: 'psu_tight',
      severity: 'warning',
      message: `PSU ${psuWattage}W has less than 20% headroom. Recommended: ${Math.ceil(withMargin)}W`,
      from_component: psu.id,
    });
  }
  
  return { compatible: issues.length === 0, issues, warnings };
}

/**
 * Check if case can fit the motherboard and GPU
 */
function checkCaseCompatibility(pcCase: PCComponent, motherboard?: PCComponent, gpu?: PCComponent): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const warnings: CompatibilityWarning[] = [];
  
  const caseFormFactor = pcCase.specs.form_factor;
  const mbFormFactor = motherboard?.specs.form_factor;
  
  // Form factor check
  if (mbFormFactor && caseFormFactor) {
    const caseLevel = FORM_FACTOR_HIERARCHY[caseFormFactor] ?? -1;
    const mbLevel = FORM_FACTOR_HIERARCHY[mbFormFactor] ?? -1;
    
    if (mbLevel > caseLevel) {
      issues.push({
        type: 'form_factor_incompatible',
        severity: 'error',
        message: `Motherboard ${mbFormFactor} does not fit in ${caseFormFactor} case`,
        from_component: motherboard?.id,
        to_component: pcCase.id,
      });
    }
  }
  
  // GPU length check
  const gpuLength = gpu?.specs.length_mm || 0;
  const maxGPULength = pcCase.specs.max_gpu_length_mm || 0;
  
  if (gpuLength > 0 && maxGPULength > 0 && gpuLength > maxGPULength) {
    issues.push({
      type: 'gpu_too_long',
      severity: 'error',
      message: `GPU length ${gpuLength}mm exceeds case maximum ${maxGPULength}mm`,
      from_component: gpu?.id,
      to_component: pcCase.id,
    });
  } else if (gpuLength > 0 && maxGPULength > 0 && gpuLength > maxGPULength * 0.9) {
    warnings.push({
      type: 'gpu_tight_fit',
      severity: 'warning',
      message: `GPU length ${gpuLength}mm is close to case maximum ${maxGPULength}mm. Check clearance.`,
      from_component: gpu?.id,
      to_component: pcCase.id,
    });
  }
  
  return { compatible: issues.length === 0, issues, warnings };
}

/**
 * Check if storage is compatible with motherboard
 */
function checkStorageMotherboard(storage: PCComponent, motherboard: PCComponent): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const warnings: CompatibilityWarning[] = [];
  
  const storageInterface = storage.specs.interface;
  const m2Slots = motherboard.specs.m2_slots || 0;
  
  // NVMe requires M.2 slot
  if (storageInterface?.includes('NVMe') && m2Slots === 0) {
    issues.push({
      type: 'no_m2_slot',
      severity: 'error',
      message: `NVMe storage requires M.2 slot but motherboard has none`,
      from_component: storage.id,
      to_component: motherboard.id,
    });
  }
  
  // Gen5 NVMe requires Gen5 slot
  if (storageInterface?.includes('Gen5') && motherboard.specs.pcie_gen !== 'Gen5') {
    warnings.push({
      type: 'pcie_gen_mismatch',
      severity: 'warning',
      message: `Gen5 NVMe storage will run at reduced speed on ${motherboard.specs.pcie_gen} motherboard`,
      from_component: storage.id,
      to_component: motherboard.id,
    });
  }
  
  return { compatible: issues.length === 0, issues, warnings };
}

/**
 * Validate a complete PC build
 */
export function validateBuild(components: PCComponent[]): CompatibilityResult {
  const allIssues: CompatibilityIssue[] = [];
  const allWarnings: CompatibilityWarning[] = [];
  
  const cpu = components.find(c => c.category === 'cpu');
  const gpu = components.find(c => c.category === 'gpu');
  const motherboard = components.find(c => c.category === 'motherboard');
  const ram = components.find(c => c.category === 'ram');
  const storage = components.find(c => c.category === 'storage');
  const psu = components.find(c => c.category === 'psu');
  const pcCase = components.find(c => c.category === 'case');
  
  // CPU-Motherboard
  if (cpu && motherboard) {
    const result = checkCPUMotherboard(cpu, motherboard);
    allIssues.push(...result.issues);
    allWarnings.push(...result.warnings);
  }
  
  // RAM-Motherboard
  if (ram && motherboard) {
    const result = checkRAMMotherboard(ram, motherboard);
    allIssues.push(...result.issues);
    allWarnings.push(...result.warnings);
  }
  
  // PSU Wattage
  if (psu) {
    const result = checkPSUWattage(psu, cpu, gpu);
    allIssues.push(...result.issues);
    allWarnings.push(...result.warnings);
  }
  
  // Case Compatibility
  if (pcCase) {
    const result = checkCaseCompatibility(pcCase, motherboard, gpu);
    allIssues.push(...result.issues);
    allWarnings.push(...result.warnings);
  }
  
  // Storage-Motherboard
  if (storage && motherboard) {
    const result = checkStorageMotherboard(storage, motherboard);
    allIssues.push(...result.issues);
    allWarnings.push(...result.warnings);
  }
  
  return {
    compatible: allIssues.length === 0,
    issues: allIssues,
    warnings: allWarnings,
  };
}

/**
 * Get compatible components for a given component
 */
export function getCompatibleComponents(
  component: PCComponent,
  allComponents: PCComponent[]
): PCComponent[] {
  return allComponents.filter(other => {
    if (other.category === component.category) return false;
    
    // CPU-Motherboard
    if (component.category === 'cpu' && other.category === 'motherboard') {
      const result = checkCPUMotherboard(component, other);
      return result.compatible;
    }
    if (component.category === 'motherboard' && other.category === 'cpu') {
      const result = checkCPUMotherboard(other, component);
      return result.compatible;
    }
    
    // RAM-Motherboard
    if (component.category === 'ram' && other.category === 'motherboard') {
      const result = checkRAMMotherboard(component, other);
      return result.compatible;
    }
    if (component.category === 'motherboard' && other.category === 'ram') {
      const result = checkRAMMotherboard(other, component);
      return result.compatible;
    }
    
    // Storage-Motherboard
    if (component.category === 'storage' && other.category === 'motherboard') {
      const result = checkStorageMotherboard(component, other);
      return result.compatible;
    }
    
    return true; // No specific rules for other combinations
  });
}

/**
 * Suggest compatible parts for a partial build
 */
export function suggestCompatibleParts(
  currentBuild: PCComponent[],
  allComponents: PCComponent[]
): Record<string, PCComponent[]> {
  const suggestions: Record<string, PCComponent[]> = {};
  
  const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case'] as const;
  
  for (const category of categories) {
    if (currentBuild.some(c => c.category === category)) continue;
    
    const candidates = allComponents.filter(c => c.category === category);
    const compatible = candidates.filter(candidate => {
      const testBuild = [...currentBuild, candidate];
      const result = validateBuild(testBuild);
      return result.compatible;
    });
    
    if (compatible.length > 0) {
      suggestions[category] = compatible;
    }
  }
  
  return suggestions;
}
