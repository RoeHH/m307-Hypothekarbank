function updatePayDueDate(riskInput) {
    let date = new Date();
    switch (riskInput.value) {
        case "Sehr Tief":
        date = new Date(new Date().getTime() + (840 * 24 * 60 * 60 * 1000));
        break; 
        case "Tief":
        date =  new Date(new Date().getTime() + (660 * 24 * 60 * 60 * 1000));
        break;
        case "Normal":
        date =  new Date(new Date().getTime() + (480 * 24 * 60 * 60 * 1000));
        break;
        case "Hoch":
        date =  new Date(new Date().getTime() + (360 * 24 * 60 * 60 * 1000));
        break;
        case "Sehr Hoch":
        date =  new Date(new Date().getTime() + (240 * 24 * 60 * 60 * 1000));
        break;
    }
    document.getElementById("payDueDate").textContent = "Die Hypothek muss bis am " + date.toLocaleDateString() + " bezahlt werden.";
}