import re

with open('src/js/ui/ui.js', 'r') as f:
    content = f.read()

import_algebra = "import { analyzeQuadratic, analyzeLinear, analyzeABC, analyzeVertex, analyzeEquationSystem, analyzeFactoring, analyzeSymmetryLine, analyzeLinearRoot, analyzeAverageRateOfChange, analyzeLog10, analyzeAsymptotes, analyzeRationalEq } from '../modules/algebra.js';"
import_geom = "import { analyzePythagoras, analyzeArea, analyzeTrigonometry, analyzeVolume, analyzeSimilarity, analyzeSector, analyzeCongruence, analyzeTriangleSolver } from '../modules/geometry.js';"
import_econ = "import { analyzeCompoundInterest, analyzeVAT, analyzeMarkup, analyzeCurrency, analyzeSalaryTax } from '../modules/economics.js';"
import_physics = "import { analyzeSpeed, analyzeDensity, analyzeMechEnergy } from '../modules/physics.js';"

val_imports = """    validateGeomSector,
    validateAlgLog10,
    validateAsymptotes,
    validateRationalEq,
    validateCongruence,
    validateTriangleSolver,
    validateCurrency,
    validateSalaryTax,
    validateMechEnergy
} from '../utils/validation.js';"""

content = re.sub(r'import \{ analyzeQuadratic.*?\} from \'../modules/algebra.js\';', import_algebra, content, flags=re.DOTALL)
content = re.sub(r'import \{ analyzePythagoras.*?\} from \'../modules/geometry.js\';', import_geom, content, flags=re.DOTALL)
content = re.sub(r'import \{ analyzeCompoundInterest.*?\} from \'../modules/economics.js\';', import_econ, content, flags=re.DOTALL)
content = re.sub(r'import \{ analyzeSpeed.*?\} from \'../modules/physics.js\';', import_physics, content, flags=re.DOTALL)

content = re.sub(r'validateGeomSector,\s*validateAlgLog10\s*\} from \'../utils/validation.js\';', val_imports, content)

with open('src/js/ui/ui.js', 'w') as f:
    f.write(content)
