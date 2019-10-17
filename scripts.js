const categoryGroup = new CategoryGroup();

var colors = ["#dd6218", "#00a899", "#e3aa05", "#94b052"];

var cartItems = [];

function CategoryGroup() {
    this.categories = {};

    this.getCategory = function(name) {
        if (!(name in this.categories)) {
            this.categories[name] = new Category();
        }
        return this.categories[name];
    };
    this.getNames = function() {
        return Object.keys(this.categories).sort();
    };
}

function Category() {
    this.rewards = [];

    this.addReward = function(reward) {
        this.rewards.push(reward);
    };
}

function Reward(name, type) {
    this.name = name;
    this.type = type; // "V" - voucher, "P" - points
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data.txt",
        dataType: "text",
        success: function(data) {
            processData(data);
        }
    });
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];
    for (var index = 1; index < allTextLines.length; index++) {
        var data = allTextLines[index].split(',');
        if (data.length == headers.length) {
            var name = data[0];
            var type = data[1];
            var category = data[2];
            categoryGroup.getCategory(category).addReward(new Reward(name, type));
        }
    }
}

document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id == 'REWARDS') {
        var categoryNames = categoryGroup.getNames();
        updateCategorySegment(categoryNames);
        var categoryIndex = document.getElementById('segment').getActiveButtonIndex();
        var rewards = getRewards([categoryNames[categoryIndex]]); //getRewards(categoryNames) if no categorisation also remember to hide category div
        updateRewards(rewards);

    } else if (page.id == 'REDEEM_VOUCHER') {
        page.querySelector('.title').innerText = page.data.title;
        var multiple = 750;
        var healthpoints = 750;
        var quantity = 1;
        updateHealthpointsQuantity(healthpoints, quantity);
        page.querySelector('#add_quantity').onclick = function () {
            healthpoints = healthpoints + multiple;
            quantity = quantity + 1;
            updateHealthpointsQuantity(healthpoints, quantity);
        };
        page.querySelector('#remove_quantity').onclick = function () {
            healthpoints = Math.max(healthpoints - multiple, 0);
            quantity = Math.max(quantity - 1, 1)
            updateHealthpointsQuantity(healthpoints, quantity);
        };

    } else if (page.id == 'REDEEM_POINTS') {
        var outletSpans = page.querySelectorAll('.outlet');
        for (outletSpan of outletSpans) {
            outletSpan.innerText = page.data.title;
        }
        var multiple = 150;
        var healthpoints = 0;
        var quantity = 0;
        updateHealthpointsQuantity(healthpoints, quantity);
        page.querySelector('#points_slider').onchange = function () {
            quantity = document.getElementById('points_slider').value;
            healthpoints = quantity * multiple;
            updateHealthpointsQuantity(healthpoints, quantity);
        }
        $('#card_id').on('input', function() {
          var value = $('#card_id').val();
          var formattedValue = formatCardNumber(value);
          $('#card_id').val(formattedValue);
        });

    } else if (page.id == 'CART') {
        updateCart();
    }
});

document.addEventListener('postchange', function (event) {
    var categoryNames = categoryGroup.getNames();
    var categoryIndex = document.getElementById('segment').getActiveButtonIndex();
    var rewards = getRewards([categoryNames[categoryIndex]]); //getRewards(categoryNames) if no categorisation
    updateRewards(rewards);
});

document.addEventListener('postpop', function(event) {
    var page = event.target.topPage;
    console.log(page.id);
    if (page.id === 'REDEEM_VOUCHER') {
        
        page.querySelector('.title').innerText = page.data.title;

        var multiple = 750;
        var healthpoints = 750;
        var quantity = 1;
        updateHealthpointsQuantity(healthpoints, quantity);
        page.querySelector('#add_quantity').onclick = function () {
            healthpoints = healthpoints + multiple;
            quantity = quantity + 1;
            updateHealthpointsQuantity(healthpoints, quantity);
        };
        page.querySelector('#remove_quantity').onclick = function () {
            healthpoints = Math.max(healthpoints - multiple, 0);
            quantity = Math.max(quantity - 1, 1)
            updateHealthpointsQuantity(healthpoints, quantity);
        };
    }
});

function getRewards(categoryNames) {
    var rewards = [];
    for (name of categoryNames) {
        var category = categoryGroup.getCategory(name);
        rewards = rewards.concat(category.rewards);
    }
    return rewards;
}

function updateCategorySegment(categoryNames) {
    var ons = "<ons-segment id='segment' style='width: 100%' active-index='0'>";
    for (name of categoryNames) {
        ons += "<button>" + name + "</button>";
    }
    ons += "</ons-segment>";
    document.getElementById("categories").innerHTML = ons;
}

function updateRewards(rewards) {
    var ons = "";
    var index = 0;
    while (index < rewards.length) {
        row = "<ons-row class='user_cover'>";
        row += updateRow(index++, colors, rewards);
        row += updateRow(index++, colors, rewards);
        row += "</ons-row>";
        ons += row;
    }
    document.getElementById("rewards").innerHTML = ons;
}

function updateRow(index, colors, rewards) {
    var color = colors[index % colors.length];
    if (index >= rewards.length) {
        return "<ons-col><div class='voucher_thumbnail'></div></ons-col>";
    } else {
        var reward = rewards[index];
        var ons = "<ons-col><div class='voucher_thumbnail' style='background-color: " + color + "' onclick='myNavigator.pushPage(`redeem_";
        if (reward.type == "V") {
            ons += "voucher";
        } else {
            ons += "points";
        }
        ons += ".html`, {data: {title: `" + reward.name + "`}})'>" + reward.name + "</div></ons-col>";
        return ons;
    }
}

function updateHealthpointsQuantity(healthpoints, quantity) {
    document.getElementById('healthpoints').innerText = healthpoints;
    document.getElementById('quantity').innerText = quantity;
}

function formatCardNumber(value) {
    // remove all non digit characters
    var value = value.replace(/\D/g, '');
    var formattedValue;
    var maxLength;
    formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    maxLength = 19;

    $('#card_id').attr('maxlength', maxLength);
    return formattedValue;
}

document.addEventListener('myevent', loggingjs.logEvent, true);

/*function sendCustomEvent() {
    console.log('sendCustomEvent');
    document.dispatchEvent(new CustomEvent('myevent', {
        detail: {
            eventName: 'myeventName',
            info: { 'key1': 'val1', 'key2': 'val2' }
        }
    }));
}


function sendCustomEvent2() {
    console.log('sendCustomEvent2');
    loggingjs.logEvent(null, 'myevent2', {
        eventName: 'myeventName',
        info: { 'key1': 'val1', 'key2': 'val2' }
    });
}*/

// When start is pressed, check if worker ID has been entered, if not, prompt
// If entered, bring user to voucher catalogue page
function startPressed() {
    var workerID = document.getElementById('workerid').value;

    if (workerID.length <= 0) {
        ons.notification.toast('WorkerID Required', { timeout: 1000, animation: 'fall' });
        sendUserErrorAction("User did not enter Worker ID");
    }
    else {
        myNavigator.pushPage(`rewards.html`);

        loggingjs.logEvent(null, 'startpressed', {
            eventName: 'startIsPressed',
            info: { 'workerID': workerID }
        });
    }

}

// Check if the user pressed redeem on the correct voucher page
function onRedeemPressed() {

    var trailNum = getUrlParam('trailnum', 1);

    var titles = ['KOI', 'Klook', 'FairPrice', 'Hillion', 'Lazada', 'LiHo', 'Actxa', 'Sportslink', 'Sembawang Shopping Centre', 'Simply Wrapps', 'Osim', 'Kallang Wave Mall'];
    var quantities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    var currentVoucherID = document.getElementById('vouchertitle').innerText;
    var correctVoucherID = titles[trailNum];

    var currentQuantity = document.getElementById('quantity').innerText;
    var correctQuantity = quantities[trailNum];

    console.log("current: " + currentVoucherID + " correct: " + correctVoucherID);
    console.log("current: " + currentQuantity + " correct: " + correctQuantity);

    if (cartItems.length == 0)
        cartItems.push({ id: currentVoucherID, quantity: currentQuantity });

    for (i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id == currentVoucherID) {
            cartItems[i].quantity = currentQuantity;
            break;
        }
        else if (i == cartItems.length - 1) {
            cartItems.push({ id: currentVoucherID, quantity: currentQuantity });
        }
    }
    myNavigator.pushPage('cart.html');
    /*
    if (currentVoucherID == correctVoucherID) {
        if (currentQuantity == correctQuantity) {
           myNavigator.pushPage('correct_end.html');

        loggingjs.logEvent(null, 'correctend', {
            eventName: 'correctEndReached',
        }); 
        }
        else {
            ons.notification.toast('Wrong quanntity entered, press the plus and minus to get the right quantity!', { timeout: 1000, animation: 'fall' });

        sendUserErrorAction("Wrong quantity entered")
        }
        
    }
    else {
        ons.notification.toast('Wrong voucher page, please go back and continue trying!', { timeout: 1000, animation: 'fall' });

        sendUserErrorAction("Wrong voucher redeemed")
    }*/
}

function goToVoucher(targetTitle) {
    myNavigator.popPage({ data: { title: targetTitle } });
}

function updateCart() {
    var ons = "";
    var index = 0;
    document.getElementById("cart_back_button").onClick = function (event) {
        // Reset the whole stack instead of popping 1 page
        document.querySelector('ons-navigator').resetToPage('rewards.html');
    };

    while (index < cartItems.length) {
        row = "<ons-list-item>";
        row += "X " + cartItems[index].quantity + " " + cartItems[index].id;
        row += "<ons-button padding: 8px modifier='quiet' ";
        row += "onclick=\"goToVoucher(" + "'" + cartItems[index++].id + "'" + ")\" >edit</ons-button>";
        row += "</ons-list-item>";
        ons += row;
    }
    document.getElementById("cart_items").innerHTML = ons;
}

// Util functions
function sendUserErrorAction(description) {
    loggingjs.logEvent(null, 'usererror', {
        eventName: 'userErrorAction',
        info: { 'description': description }
    });
}

function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}