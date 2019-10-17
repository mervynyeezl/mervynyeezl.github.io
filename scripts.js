var vouchers = ["TapForMore", "Transitlink", "AIBI", "BOUNCE", "FairPrice", "Hillion", "Kallang Wave Mall", "Key Power", "Klook", "KOI", "Lazada", "LiHo", "Mr Bean", "Polar Puffs & Cakes", "Qi Ji", "QQ Rice", "Sembawang Shopping Centre", "Simply Wrapps", "Sportslink", "Actxa", "AsiiaMalls", "FairPrice Online App/Web", "Osim"];
var colors = ["#dd6218", "#00a899", "#e3aa05", "#94b052"];

var cartItems = [];

document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'REWARDS') {
        updateVouchers();

    } else if (page.id === 'REDEEM_REWARD') {
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
    } else if (page.id == 'CART') {
        updateCart();
    }
});

document.addEventListener('postpop', function(event) {
    var page = event.target.topPage;
    console.log(page.id);
    if (page.id === 'REDEEM_REWARD') {
        
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

function updateVouchers() {
    var ons = "";
    var index = 0;
    while (index < vouchers.length) {
        row = "<ons-row class='user_cover'>";
        row += updateRow(index++, colors, vouchers);
        row += updateRow(index++, colors, vouchers);
        row += "</ons-row>";
        ons += row;
    }
    document.getElementById("vouchers").innerHTML = ons;
}

function updateRow(index) {
    var color = colors[index % colors.length];
    if (index >= vouchers.length) {
        return "<ons-col><div class='voucher_thumbnail'></div></ons-col>";
    } else {
        var voucher = vouchers[index];
        return "<ons-col>" +
            "<div class='voucher_thumbnail' style='background-color: " + color + "' onclick='myNavigator.pushPage(`redeem_reward.html`, {data: {title: `" + voucher + "`}})'>" +
            voucher + "</div></ons-col>";
    }
}

function updateHealthpointsQuantity(healthpoints, quantity) {
    document.getElementById('healthpoints').innerText = healthpoints;
    document.getElementById('quantity').innerText = quantity;
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