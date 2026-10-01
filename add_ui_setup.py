import re

with open('src/js/ui/ui.js', 'r') as f:
    content = f.read()

setup_code = """
    setupAdvancedModuleUI('asymptotes',
        (fd) => validateAsymptotes(fd.get('a'), fd.get('b'), fd.get('c'), fd.get('d')),
        (vals, fd) => analyzeAsymptotes(vals.a, vals.b, vals.c, vals.d),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('rational-eq',
        (fd) => validateRationalEq(fd.get('a'), fd.get('b'), fd.get('c')),
        (vals, fd) => analyzeRationalEq(vals.a, vals.b, vals.c),
        (res) => `<strong>x =</strong> ${typeof res.result === 'number' ? res.result.toFixed(2) : res.result}`
    );

    setupAdvancedModuleUI('congruence',
        (fd) => validateCongruence(fd.get('t1_1'), fd.get('t1_2'), fd.get('t1_3'), fd.get('t2_1'), fd.get('t2_2'), fd.get('t2_3')),
        (vals, fd) => analyzeCongruence(fd.get('method'), vals.t1, vals.t2),
        (res) => `<strong>Svar:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('triangle-solver',
        (fd) => validateTriangleSolver(fd.get('val1'), fd.get('val2'), fd.get('val3')),
        (vals, fd) => analyzeTriangleSolver(fd.get('method'), vals.val1, vals.val2, vals.val3),
        (res) => `<strong>Ukjent ${res.type}:</strong> ${typeof res.result === 'number' ? res.result.toFixed(2) + (res.type === 'vinkel' ? '°' : '') : res.result}`
    );

    setupAdvancedModuleUI('currency',
        (fd) => validateCurrency(fd.get('amount'), fd.get('rate'), fd.get('fromCurr'), fd.get('toCurr')),
        (vals, fd) => analyzeCurrency(vals.amount, vals.rate, vals.fromCurr, vals.toCurr),
        (res) => `<strong>Resultat:</strong> ${res.result.toFixed(2)}`
    );

    setupAdvancedModuleUI('salary-tax',
        (fd) => validateSalaryTax(fd.get('gross'), fd.get('taxRate'), fd.get('deduction')),
        (vals, fd) => analyzeSalaryTax(vals.gross, vals.taxRate, vals.deduction),
        (res) => `<strong>Nettolønn:</strong> ${res.result.toFixed(2)} kr`
    );

    setupAdvancedModuleUI('mech-energy',
        (fd) => validateMechEnergy(fd.get('m'), fd.get('v'), fd.get('h')),
        (vals, fd) => analyzeMechEnergy(vals.m, vals.v, vals.h),
        (res) => `<strong>Total Mekanisk Energi:</strong> ${res.result.toFixed(2)} J`
    );

    // Dynamic UI updates for Congruence and Triangle Solver
    const triSolverMethod = document.getElementById('tri-method');
    if (triSolverMethod) {
        triSolverMethod.addEventListener('change', (e) => {
            const method = e.target.value;
            const l1 = document.getElementById('label-tri-1');
            const l2 = document.getElementById('label-tri-2');
            const l3 = document.getElementById('label-tri-3');
            if (method === 'SAS') {
                l1.innerText = 'Side b:';
                l2.innerText = 'Side c:';
                l3.innerText = 'Vinkel A (°):';
            } else if (method === 'SSS') {
                l1.innerText = 'Side a:';
                l2.innerText = 'Side b:';
                l3.innerText = 'Side c:';
            }
        });
    }

    // Oppdater graf på tema-bytte
"""

content = content.replace('    // Oppdater graf på tema-bytte', setup_code)

with open('src/js/ui/ui.js', 'w') as f:
    f.write(content)
