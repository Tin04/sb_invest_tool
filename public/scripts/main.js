const updateButton = $('#update-button');
const itemListBody = $('#item-list-body');
let itemList = [];

// click -> call backend -> get data from json -> call 3rd party api
updateButton.on('click', () => {
    fetch('/api/update')
        .then(response => response.json())
        .then(data => {
            $("#total-cost-value").text(data['totalCost'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#total-worth-value").text(data['totalWorth'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            // Update the table with the new data
            $.each(data['items'], function(key, value) {
                console.log(itemList);
                // if itemList contains key
                if (itemList.includes(key)) {
                    // get the index of key in itemList
                    const index = itemList.indexOf(key);
                    // based on the index, udpate the corresponding row in table
                    const row = itemListBody.find('tr').eq(index);
                    row.find('td').eq(1).text(value.price);
                    row.find('td').eq(2).text(value.avgCost);
                    row.find('td').eq(3).text(value.quantity);
                } else {
                    // add to tracked item list
                    itemList.push(key);
                    // add a new row in the table
                    const newRow = $('<tr>');
                    newRow.append($('<td>').text(key));
                    newRow.append($('<td>').text(value.price));
                    newRow.append($('<td>').text(value.avgCost));
                    newRow.append($('<td>').text(value.quantity));
                    itemListBody.append(newRow);
                }
                // change bg color depend on profit/loss
                const index = itemList.indexOf(key);
                const row = itemListBody.find('tr').eq(index);
                if (value.price > value.avgCost) {
                    row.addClass('highlight-green');
                } else if (value.price < value.avgCost) {
                    row.addClass('highlight-red');
                }
            });   
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});

// Submit event for the input form
$("#record-form").on("submit", (e) => {
    // Do not submit the form
    e.preventDefault();
    // Get the input fields
    const itemName = $("#item-name").val().trim();
    const itemTag = $("#item-tag").val().trim();
    const itemQuantity = $("#item-quantity").val().trim();
    const itemPrice = $("#item-price").val().trim();
    const action = $("#action").val().trim();
    // Send a register request
    Record.record(itemName, itemTag, itemQuantity, itemPrice, action,
        () => {
            $("#record-form").get(0).reset();
            $("#record-message").text("Record submitted.");
        },
        (error) => { $("#record-message").text(error); }
    );
    // update list
    $("#update-button").click();
});
// init update
$(function() {
    $("#update-button").click();
    $("#record-form").hide();

    // just get the time, no need know the exact item
    const fireSaleData = fetch('/api/firesale')
        .then(response => response.json())
        .then(data => {
            if (data['status'] === "error") {
                $("#countdown").text(data['error']);
            } else {
                if (!('data' in data)) {
                    $("#countdown").text("No scheduled firesale");
                } else {
                    console.log(1);
                    const eventDate = new Date(data['data']['start']).getTime();
                    const timer = setInterval(function() {
                        const now = new Date().getTime();
                        const distance = eventDate - now;
                        if (distance < 0) {
                            clearInterval(timer);
                            $("#countdown").html("Event has started!");
                            return;
                        }
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    $("#countdown").html(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                }, 1000);
                $("#countdown").text("Firesale data updated successfully.");
                }
                
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

});