const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbol");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()_-=+[]{}|;:,<.>/?";

lengthSlider.addEventListener("input", () => {
    lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click", makePassword);

function makePassword() {
    const length = Number(lengthSlider.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;

    if(!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        alert("Please select at least one char type.");
        return;
    }

    const newPassword = createRandomPassword(length,includeUppercase, includeLowercase, includeNumbers, includeSymbols);

    passwordInput.value = newPassword;
    updateStrengthMeter(newPassword);
}

copyButton.addEventListener("click", function() {

    const password = passwordInput.value;

    if (password === "") {
        alert("Please generate a password first.");
        return;
    }

    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(password)
        .then(() => {
            alert("Password copied successfully!");
        })
        .catch(() => {
            // Fallback for browsers where Clipboard API is unavailable
            const copied = document.execCommand("copy");

            if (copied) {
                alert("Password copied successfully!");
            } else {
                alert("Unable to copy password.");
            }
        });

});

function updateStrengthMeter(password) {
    const passwordLength = password.length;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_\-=+\[\]{}|;:,<.>/?]/.test(password);

    let strengthScore = 0;

    strengthScore += Math.min(passwordLength * 2, 40);

    if(hasUppercase) strengthScore += 15;
    if(hasLowercase) strengthScore += 15;
    if(hasNumber) strengthScore += 15;
    if(hasSymbol) strengthScore += 15;

    if(passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    const safeScore = Math.max(5, Math.min(100,strengthScore));
    strengthBar.style.width = safeScore + "%";

    let strengthLabelText = "";
    let barColor = "";

    if(strengthScore < 40) {
        barColor = "#fc8181";
        strengthLabelText = "Weak"
    } else if (strengthScore < 70) {
        barColor = "#fbd38d";
        strengthLabelText = "Medium";
    } else {
        barColor = "#68d391";
        strengthLabelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
}

function createRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let allCharacters = ""; 

    if(includeUppercase){
    allCharacters += uppercaseLetters;
    }

    if(includeLowercase){
        allCharacters += lowercaseLetters;
    }

    if(includeNumbers) {
        allCharacters += numberCharacters;
    }

    if(includeSymbols) {
        allCharacters += symbolCharacters;
    }

    let password = "";

    for(let i = 0; i<length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }

    return password;
}