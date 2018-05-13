"use strict";
console.log('asdf');
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var counter = 0;
var VERSION = [3, 4, 0];
var MIN_VERSION = [3, 4, 0];

var stats = [0, 0, 0, 0, 0, 0];

var savedGame = JSON.parse(localStorage.getItem("savedGame"));
if ("savedGame" in localStorage && savedGame.version >= MIN_VERSION) {
    stats = savedGame.stats;
}

function generateItem(name, costFunction, impactFunction, count) {
    return {
        count: count,
        name: name,
        cost: costFunction,
        impact: impactFunction
    };
}

function generateItemFromItem(item) {
    var newItem = generateItem(item.name, item.cost, item.impact);
    newItem.count = item.count;
    return newItem;
}

function ProductivityButton(props) {
    return React.createElement(
        "div",
        { className: "productivity-button" },
        React.createElement(
            "button",
            { onClick: props.click },
            "Complete Task(s)"
        )
    );
}

function Stat(props) {
    return React.createElement(
        "div",
        { className: "stats-panel-item" },
        props.name,
        ": ",
        props.count
    );
}

function AdvancedStat(props) {
    return React.createElement(
        "div",
        { className: "stats-panel-item" },
        props.item.name,
        ": ",
        props.item.count
    );
}

function Logo(props) {
    return React.createElement(
        "div",
        { className: "logo" },
        "Productivity Counter"
    );
}

function StatsPanel(props) {
    return React.createElement(
        "div",
        { className: "stats-panel" },
        React.createElement(Logo, null),
        React.createElement(Stat, { name: "Tasks", count: props.tasksCount }),
        React.createElement(Stat, { name: "Productivity", count: props.productivityCount }),
        props.items.map(function (item) {
            return React.createElement(AdvancedStat, { item: item, key: item.name + 'stat' });
        }),
        React.createElement(ProductivityButton, { click: props.click })
    );
}

function UpgradeItem(props) {
    return React.createElement(
        "div",
        { className: "upgrade-item", onClick: function onClick() {
                return props.buyItem(props.item);
            } },
        React.createElement(
            "div",
            { className: "task-text" },
            props.item.name,
            " (Costs ",
            props.item.cost(props.item),
            " productivity.)"
        )
    );
}

function UpgradePanel(props) {
    return React.createElement(
        "div",
        { className: "upgrade-panel" },
        React.createElement("img", { src: "backdrop.jpg", style: { width: 100 + "%" } }),
        props.items.map(function (item) {
            return React.createElement(UpgradeItem, { item: item, buyItem: props.buyItem, key: item.name + 'upgrade' });
        })
    );
}

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            tasksCount: stats[0] || 100,
            productivityCount: stats[1] || 100,
            items: [generateItem('Legal Pads', function (item) {
                return item.count + 1;
            }, function (item) {
                return { tasks: item.count };
            }, stats[2]), generateItem('Todo Apps', function (item) {
                return item.count * 35 + 35;
            }, function (item) {
                return { tasks: item.count * 5 };
            }, stats[3]), generateItem('Multitasking', function (item) {
                return 50 * Math.pow(item.count, 2) + 100;
            }, function (item) {
                return {};
            }, stats[4]), generateItem('Python Scripts', function (item) {
                return item.count * 3500 + 1000;
            }, function (item) {
                return { productivity: Math.pow(item.count, 3) };
            }, stats[5])]
        };
        _this.tick = _this.tick.bind(_this);
        _this.click = _this.click.bind(_this);
        _this.buyItem = _this.buyItem.bind(_this);

        window.setInterval(_this.tick, 1000);
        return _this;
    }

    _createClass(App, [{
        key: "buyItem",
        value: function buyItem(itemType) {
            var _this2 = this;

            var cost = itemType.cost(itemType);
            if (this.state.productivityCount >= cost) {
                this.setState(function (currentState) {
                    // clone dictionary
                    var items = [];
                    for (var i = 0; i < currentState.items.length; i++) {
                        var item = generateItemFromItem(currentState.items[i]);
                        if (item.name == itemType.name) {
                            item.count += 1;
                        }
                        items.push(item);
                    }

                    return {
                        productivityCount: _this2.state.productivityCount - cost,
                        items: items
                    };
                });
            }
        }
    }, {
        key: "getItemByName",
        value: function getItemByName(name) {
            for (var i = 0; i < this.state.items.length; i++) {
                if (this.state.items[i].name == name) {
                    return this.state.items[i];
                }
            }
            return null;
        }
    }, {
        key: "click",
        value: function click() {
            var conversion = Math.min(1 + Math.pow(this.getItemByName("Multitasking").count, 2), this.state.tasksCount);
            this.setState(function (currentState) {
                return {
                    tasksCount: currentState.tasksCount - conversion,
                    productivityCount: currentState.productivityCount + conversion
                };
            });
        }
    }, {
        key: "tick",
        value: function tick() {
            counter += 1;
            if (counter % 15 == 0) {
                var _stats = [this.state.tasksCount, this.state.productivityCount].concat(this.state.items.map(function (item) {
                    return item.count;
                }));

                localStorage.setItem("savedGame", JSON.stringify({
                    version: VERSION,
                    stats: _stats
                }));
            }

            this.setState(function (currentState) {
                var newTasksCount = currentState.tasksCount + 1;
                var newProductivityCount = currentState.productivityCount;

                for (var i = 0; i < currentState.items.length; i++) {
                    if (currentState.items[i].impact(currentState.items[i]).tasks) {
                        newTasksCount += currentState.items[i].impact(currentState.items[i]).tasks;
                    }
                    if (currentState.items[i].impact(currentState.items[i]).productivity) {
                        newProductivityCount += currentState.items[i].impact(currentState.items[i]).productivity;
                    }
                }

                return {
                    tasksCount: newTasksCount,
                    productivityCount: newProductivityCount
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "app-container" },
                React.createElement(StatsPanel, {
                    tasksCount: this.state.tasksCount,
                    productivityCount: this.state.productivityCount,
                    items: this.state.items,
                    click: this.click
                }),
                React.createElement(UpgradePanel, {
                    items: this.state.items,
                    buyItem: this.buyItem
                })
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
