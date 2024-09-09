const Record = (function() {
    // This function sends a record request to the server

    const record = function(itemName, itemTag, itemQuantity, itemPrice, action, onSuccess, onError) {
        const data = JSON.stringify({itemName, itemTag, itemQuantity, itemPrice, action});

        fetch("/api/record", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        })
        .then((res) => res.json() )
        .then((json) => {
            if (json.status === "error") {
                if (onError) onError(json.error);
            }
            if (json.status === "success") {
                if (onSuccess) onSuccess();
            }
        })
        .catch((err) => {
            console.log("Error!");
        });
    };
    
    return { record };
})();
