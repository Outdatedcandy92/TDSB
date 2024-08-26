document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");


    //TODO: ENCRYPT PASSWORD
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const studentNumber = document.getElementById("input1").value;
        const password = document.getElementById("input2").value;
        const rememberMe = document.getElementById("checkbox").checked;

        console.log("Student Number:", studentNumber);
        console.log("Password:", password);
        console.log("Remember Me:", rememberMe);


    fetch("https://zappsmaprd.tdsb.on.ca/token", {
        method: "POST",
        headers: {
            "Content-Type": "x-www-form-urlencoded",
            "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username: studentNumber,
            password: password,
            grant_type: "password",
        })
    })
        .then(response => response.json())
        .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    });
});