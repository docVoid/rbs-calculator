const display = document.getElementById('display');
let currentMode = 'degrees'; 

function appendToDisplay(value) {
    if (value === 'sqrt(') {
        display.value += '√';
    } else if (value === ')') {
        display.value += ')';
    } else if (value === 'pi') {
        display.value += 'π';
    } else if (value.startsWith('Math.') || value === '%') {
        display.value += value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        const expression = display.value;
        let result = evaluateExpression(expression);
        result = fixFloatingPointError(result); // Fix floating point error
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

function evaluateExpression(expression) {
    expression = expression.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)')
                           .replace(/%/g, '/100')
                           .replace(/π/g, 'Math.PI')
                           .replace(/sin\(/g, 'Math.sin(')
                           .replace(/cos\(/g, 'Math.cos(')
                           .replace(/tan\(/g, 'Math.tan(');

    if (currentMode === 'degrees') {
        expression = expression.replace(/Math.sin\(([^)]+)\)/g, function(match, p1) {
            return 'Math.sin(degToRad(' + p1 + '))';
        });
        expression = expression.replace(/Math.cos\(([^)]+)\)/g, function(match, p1) {
            return 'Math.cos(degToRad(' + p1 + '))';
        });
        expression = expression.replace(/Math.tan\(([^)]+)\)/g, function(match, p1) {
            return 'Math.tan(degToRad(' + p1 + '))';
        });
    }

    try {
        return eval(expression);
    } catch (error) {
        throw new Error('Ungültiger Ausdruck');
    }
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function fixFloatingPointError(value) {
    return Math.abs(value) < 1e-10 ? 0 : value;
}

function changeMode(mode) {
    currentMode = mode;
}

document.addEventListener('keydown', function (event) {
    const key = event.key;
    const allowedKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '.', 'Enter', 'Backspace', 'Escape', '%'
    ];

    if (allowedKeys.includes(key)) {
        event.preventDefault();

        switch (key) {
            case 'Enter':
                calculate();
                break;
            case 'Backspace':
                clearDisplay();
                break;
            case 'Escape':
                clearDisplay();
                break;
            case '%':
                appendToDisplay('%');
                break;
            default:
                appendToDisplay(key);
                break;
        }
    }
});