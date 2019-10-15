var vouchers = ["TapForMore", "Transitlink", "AIBI", "BOUNCE", "FairPrice", "Hillion", "Kallang Wave Mall", "Key Power", "Klook", "KOI", "Lazada", "LiHo", "Mr Bean", "Polar Puffs & Cakes", "Qi Ji", "QQ Rice", "Sembawang Shopping Centre", "Simply Wrapps", "Sportslink", "Actxa", "AsiiaMalls", "FairPrice Online App/Web", "Osim"];
var colors = ["#dd6218", "#00a899", "#e3aa05", "#94b052"];

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
        var healthpoints = 0;
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
    var currentVoucherID = document.getElementById('vouchertitle').innerText;
    var correctVoucherID = getUrlParam('voucher','Empty');

    var currentQuantity = document.getElementById('quantity').innerText;
    var correctQuantity = getUrlParam('quantity', 1)

    console.log("current: " + currentVoucherID + " correct: " + correctVoucherID);
    console.log("current: " + currentQuantity + " correct: " + correctQuantity);

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
    }
}


// Util functions
function sendUserErrorAction(description) {
    loggingjs.logEvent(null, 'usererror', {
        eventName: 'userErrorAction',
        info: { 'description': description }
    });
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}