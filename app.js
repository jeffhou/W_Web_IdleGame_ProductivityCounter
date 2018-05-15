var counter = 0;
const VERSION = [3, 4, 0]
const MIN_VERSION = [3, 4, 0]

var stats = [0, 0, 0, 0, 0, 0]

var savedGame = JSON.parse(localStorage.getItem("savedGame"))
if ("savedGame" in localStorage && savedGame.version >= MIN_VERSION) {
    stats = savedGame.stats
}

function generateItem (name, costFunction, impactFunction, count) {
    return {
        count: count,
        name: name,
        cost: costFunction,
        impact: impactFunction,
    }
}

function generateItemFromItem (item) {
    let newItem = generateItem(item.name, item.cost, item.impact)
    newItem.count = item.count
    return newItem
}

function ProductivityButton (props) {
    return (
        <div className="productivity-button">
        <button onClick={props.click}>Complete Task(s)</button>
        </div>
    )
}

function Stat (props) {
    return (
        <div className="stats-panel-item">{props.name}: {props.count}</div>
    )
}

function AdvancedStat (props) {
    return (
        <div className="stats-panel-item">{props.item.name}: {props.item.count}</div>
    )
}

function Logo (props) {
    return (
        <div className="logo">Productivity Counter</div>
    )
}

function StatsPanel (props) {
    return (
        <div className="stats-panel">
        <Logo />
        <Stat name="Tasks" count={props.tasksCount} />
        <Stat name="Productivity" count={props.productivityCount} />
        {props.items.map((item) => (
            <AdvancedStat item={ item } key={ item.name + 'stat'} />
        ))}
        <ProductivityButton click={props.click}/>
        </div>
    )
}

function UpgradeItem (props) {
    return (
        <div className="upgrade-item" onClick={ () => props.buyItem(props.item) }>
        <div className="task-text">
            { props.item.name } (Costs { props.item.cost(props.item) } productivity.)
        </div>
        </div>
    )
}

function UpgradePanel (props) {
    return (
        <div className="upgrade-panel">
        <img src="backdrop.jpg" style={{width: 100 + "%"}}/>
        {props.items.map((item) => (
            <UpgradeItem item={ item } buyItem={ props.buyItem } key={ item.name + 'upgrade'} />
        ))}
        </div>
    )
}

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            tasksCount: stats[0] || 100,
            productivityCount: stats[1] || 100,
            items: [
                generateItem(
                    'Legal Pads',
                    item => item.count + 1,
                    item => {
                        return { tasks: item.count }
                    },
                    stats[2],
                ),
                generateItem(
                    'Todo Apps',
                    item => item.count * 35 + 35,
                    item => {
                        return { tasks: item.count * 5 }
                    },
                    stats[3],
                ),
                generateItem(
                    'Multitasking',
                    item => 50 * item.count ** 2 + 100,
                    item => {
                        return {}
                    },
                    stats[4],
                ),
                generateItem(
                    'Python Scripts',
                    item => item.count * 3500 + 1000,
                    item => {
                        return { productivity: item.count ** 3 }
                    },
                    stats[5],
                ),
            ]
        }
        this.tick = this.tick.bind(this)
        this.click = this.click.bind(this)
        this.buyItem = this.buyItem.bind(this)

        window.setInterval(this.tick, 1000);
    }

    buyItem (itemType) {
        const cost = itemType.cost(itemType)
        if (this.state.productivityCount >= cost) {
        this.setState((currentState) => {
            // clone dictionary
            let items = []
            for (let i = 0; i < currentState.items.length; i++) {
                let item = generateItemFromItem(currentState.items[i])
                if (item.name == itemType.name) {
                    item.count += 1
                }
                items.push(item)
            }

            return {
                productivityCount: this.state.productivityCount - cost,
                items: items
            }
        })
        }
    }

    getItemByName (name) {
        for (let i = 0; i < this.state.items.length; i++) {
            if (this.state.items[i].name == name) {
                return this.state.items[i]
            }
        }
        return null
    }

    click () {
        const conversion = Math.min(1 + this.getItemByName("Multitasking").count ** 2, this.state.tasksCount)
        this.setState((currentState) => {
            return {
                tasksCount: currentState.tasksCount - conversion,
                productivityCount: currentState.productivityCount + conversion,
            }
        })
    }

    tick () {
        counter += 1
        if (counter % 15 == 0) {
            let stats = [
                this.state.tasksCount,
                this.state.productivityCount
            ].concat(this.state.items.map(item => item.count));

            localStorage.setItem("savedGame", JSON.stringify({
                version: VERSION,
                stats: stats
            }))
        }

        this.setState((currentState) => {
            var newTasksCount = currentState.tasksCount + 1
            var newProductivityCount = currentState.productivityCount

            for (let i = 0; i < currentState.items.length; i++) {
                if (currentState.items[i].impact(currentState.items[i]).tasks) {
                    newTasksCount += currentState.items[i].impact(currentState.items[i]).tasks
                }
                if (currentState.items[i].impact(currentState.items[i]).productivity) {
                    newProductivityCount += currentState.items[i].impact(currentState.items[i]).productivity
                }
            }

            return {
                tasksCount: newTasksCount,
                productivityCount: newProductivityCount,
            }
        })
    }

    render () {
        return (
        <div className="app-container">
        <StatsPanel
            tasksCount = {this.state.tasksCount}
            productivityCount = {this.state.productivityCount}
            items = {this.state.items}
            click = {this.click}
            />

        <UpgradePanel
            items = {this.state.items}
            buyItem = { this.buyItem }
        />
        </div>
        )
    }
    }

    ReactDOM.render(
    <App />,
    document.getElementById('app')
    )