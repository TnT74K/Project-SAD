function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);

    if (input.type === 'password') {
            input.type = 'tex';
                icon.textContent = '🙈';
            } 
            else {
                input.type = 'password';
                icon.textContent = '👁';
        }
}
