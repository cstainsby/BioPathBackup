/* basic function where if concentration[i] greater than previous you subtract
from i - 1 and add to i
*/
export function runConcentrations (concentrations, filled) {
    for (let i = 0; i < concentrations.length; i++) {
        if (i > 0) { 
            // if concentrations are not first or last egde
            if (concentrations[i - 1] < 5) { // concentration to low for reaction to occur
                concentrations[i] = 0;
            }
            else if (concentrations[i - 1] > concentrations[i]) {
                concentrations[i-1] = concentrations[i-1] - .05;
                concentrations[i] = concentrations[i] + .05;
            }
            else if (concentrations[i - 1] < concentrations[i]) { // TODO:
                // if reaction is reversible, molecule at (i) converted to molecule at (i-1)
            }
        }
    }
    return concentrations;
}

/* function that deals with reversible reaction
*/
export function run (concentrations, reversibleSteps, stopSteps) {
    for (let i = 0; i < concentrations.length; i++) {
        // if (stopSteps.includes(i)) {

        // }
        if (i > 0) { 
            // if concentrations are not first or last egde
            if (concentrations[i - 1] == 0) { // concentration to low for reaction to occur
                concentrations[i] = 0;
            }
            else if (reversibleSteps.includes[i]) {
                if (concentrations[i - 1] > concentrations[i]) {
                    concentrations[i-1] = concentrations[i-1] - .05;
                    concentrations[i] = concentrations[i] + .05;
                }
                else {
                    concentrations[i-1] = concentrations[i-1] + .05;
                    concentrations[i] = concentrations[i] - .05;
                }
            }
            else {
                if (concentrations[i - 1] > concentrations[i]) {
                    concentrations[i-1] = concentrations[i-1] - .05;
                    concentrations[i] = concentrations[i] + .05;
                }
            }
        }
    }
    return concentrations;
}


export function run2 (concentrations, reversibleSteps, stopSteps) {
    for (let i = 0; i < concentrations.length; i++) {
            // if concentrations are not first or last egde
        if (concentrations[i - 1] == 0) { // concentration to low for reaction to occur
            concentrations[i] = 1;
        }
        else if (reversibleSteps.includes(i)) {
            if (concentrations[i - 1] > concentrations[i]) {
                // concentrations[i-1] = concentrations[i-1] - .05;
                // concentrations[i] = concentrations[i] + .05;
                let concChange = concentrations[i] / concentrations[i-1] * 1;
                concentrations[i] = concentrations[i] + concChange;
                concentrations[i - 1] = concentrations[i - 1] - concChange;

            }
            else {
                // concentrations[i-1] = concentrations[i-1] + .05;
                // concentrations[i] = concentrations[i] - .05;
                let concChange = concentrations[i] / concentrations[i-1] * 1;
                concentrations[i] = concentrations[i] - concChange;
                concentrations[i - 1] = concentrations[i - 1] + concChange;
            }
        }
        else {
            if (concentrations[i - 1] > concentrations[i]) {
                concentrations[i-1] = concentrations[i-1] - .05;
                concentrations[i] = concentrations[i] + .05;
            }
        }
    }
    return concentrations;
}