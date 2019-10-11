<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="lib/onsen/css/onsenui.css">
    <link rel="stylesheet" href="lib/onsen/css/onsen-css-components.min.css">
    <script src="lib/onsen/js/onsenui.min.js"></script>
    <script src="logging.js"></script>
    <script src="scripts.js"></script>

</head>

<body>

    <ons-navigator swipeable id="myNavigator">
        <ons-page id="catalogue-page">
            <ons-toolbar>
                <div class="left">
                    <ons-toolbar-button>
                        <ons-icon icon="fa-long-arrow-alt-left"></ons-icon>
                    </ons-toolbar-button>
                </div>
                <div class="center">REWARDS</div>
                <div class="right">
                    <ons-toolbar-button>
                        <ons-icon icon="ion-ios-paperplane-outline"></ons-icon>
                    </ons-toolbar-button>
                </div>
            </ons-toolbar>



            <ons-tabbar swipeable position="bottom">
                <ons-tab page="tab1.html" label="DASHBOARD" icon="fa-stopwatch" active>
                </ons-tab>
                <ons-tab label="CHALLENGES" icon="fa-flag" active-icon="md-face">
                </ons-tab>
                <ons-tab label="DIET JOURNAL" icon="fa-utensils" active-icon="md-face">
                </ons-tab>
                <ons-tab label="HISTORY" icon="fa-clipboard-list" active-icon="md-face">
                </ons-tab>
            </ons-tabbar>
        </ons-page>
    </ons-navigator>

    <template id="tab1.html">
        <ons-page id="REWARDS">
            <div id="vouchers"></div>

        </ons-page>
    </template>

    <template id="redeem_reward.html">
        <ons-page id="REDEEM_REWARD">
            <ons-toolbar>
                <div class="left">
                    <ons-back-button></ons-back-button>
                </div>
                <div class="center">REDEEM REWARD</div>
                <div class="right">
                    <ons-toolbar-button>
                        <ons-icon icon="ion-ios-paperplane-outline"></ons-icon>
                    </ons-toolbar-button>
                </div>
            </ons-toolbar>

            <ons-card class="redeem">
                <br />
                <div class="title"></div>
                <br />
                <div class="content">
                    <div class="redeem_content" style="font-weight: bold">$5 eVoucher</div>
                    <div class="redeem_content">750 healthpoints</div>
                    <br />
                    <ons-row>
                        <ons-col class="redeem_content">Healthpoints</ons-col>
                        <ons-col class="redeem_content">Quantity</ons-col>
                    </ons-row>
                    <br />
                    <ons-row>
                        <ons-col class="redeem_content" id="healthpoints"></ons-col>
                        <ons-col class="redeem_content">
                            <ons-row>
                                <ons-col><ons-icon icon="ion-ios-remove-circle-outline" size="lg" id="remove_quantity"></ons-icon></ons-col>
                                <ons-col id="quantity"></ons-col>
                                <ons-col><ons-icon icon="ion-ios-add-circle-outline" size="lg" id="add_quantity"></ons-icon></ons-col>
                            </ons-row>
                        </ons-col>
                    </ons-row>
                    <br />
                    <ons-list>
                        <ons-list-header>Reward Information</ons-list-header>
                        <ons-list-item>Please brighten your screen display before using the eVoucher</ons-list-item>
                        <ons-list-item>Accepted at all outlets except Causeway Point</ons-list-item>
                    </ons-list>
                </div>
            </ons-card>

            <ons-bottom-toolbar>
                <ons-button class="redeem_button" modifier="large--quiet">Redeem</ons-button>
            </ons-bottom-toolbar>


        </ons-page>
    </template>

    <ons-button onclick="alert('Hello World!')">Click Me</ons-button>

    <script>
        function sendCustomEvent() {
            console.log('sendCustomEvent');
            document.dispatchEvent(new CustomEvent('myevent', {
                detail: {
                    eventName: 'myeventName',
                    info: { 'key1': 'val1', 'key2': 'val2' }
                }
            }));
        }
        document.addEventListener('myevent', loggingjs.logEvent, true);

        function sendCustomEvent2() {
            console.log('sendCustomEvent2');
            loggingjs.logEvent(null, 'myevent2', {
                eventName: 'myeventName',
                info: { 'key1': 'val1', 'key2': 'val2' }
            });
        }
    </script>

    <div id="label">Label</div>
    <input id="inText" type="text" />
    <input id="btn" value="Send Custom Event" type="button" onclick="sendCustomEvent()" />
    <input id="btn2" value="Send Custom Event 2" type="button" onclick="sendCustomEvent2()" />

</body>

</html>