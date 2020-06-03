import DBotTree from "./DBotTree";
import TLogs from "../TLogs";

class MsgInterpretation {

    constructor() {
        this.step = undefined;
        this.finalActions = {
            enterInt: function (message) {
                let numbs = message.match(/[+-]?\d+(\.\d+)?/g);
                if (!numbs) {
                    return;
                }
                numbs.forEach(function (i, j) {
                    numbs[j] = parseInt(i);
                });
                return numbs[0];
            },
            enterDouble: function (message) {
                let numbs = message.match(/[+-]?\d+(\.\d+)?/g);
                if (!numbs) {
                    return;
                }
                numbs.forEach(function (i, j) {
                    numbs[j] = parseFloat(i);
                });
                return numbs[0];
            }
        };
        this.clear = this.clear.bind(this);
        this.isBlockMatching = this.isBlockMatching.bind(this);
        this.checkEachBlockForMatch = this.checkEachBlockForMatch.bind(this);
        this.findTreeBlock = this.findTreeBlock.bind(this);
        this.parseAction = this.parseAction.bind(this);
    }

    isBlockMatching(key, message, step) {
        TLogs.p("isBlockMatching: ", key, step);
        let block = DBotTree[key];

        if (block.requirements && block.requirements.step !== step) {
            TLogs.p("XX - Block refused due to requirements");
            return false;
        }

        let words = message.toLowerCase().split(" ");

        for (let i = 0; i < words.length; ++i) {
            if (words[i].indexOf(block.filters.primary) !== -1) {
                // CHECK OPTIONAL FILTERS
                if (words[i].length !== block.filters.primary.length) {
                    for (let i2 in block.filters.opt) {
                        if (block.filters.opt[i2] === words[i]) {
                            return true;
                        }
                    }
                } else if (block.filters.secondary.length === 0) {
                    return true;
                } else {
                    // CHECK SECONDARY WORD
                    let next = i + 1;
                    if (next < words.length) {
                        for (let i2 in block.filters.secondary) {
                            if (words[next] === block.filters.secondary[i2]) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    checkEachBlockForMatch(keys, message, step) {
        TLogs.p("checkEachBlockForMatch: ", keys, step);
        for (let i in keys) {
            if (this.isBlockMatching(keys[i], message, step)) {
                if (DBotTree[keys[i]].children) {
                    let child = this.checkEachBlockForMatch(DBotTree[keys[i]].children, message, keys[i]);
                    if (child) {
                        return child;
                    }
                }
                return DBotTree[keys[i]];
            }
        }
    }

    findTreeBlock(message, step) {
        TLogs.p("Find block from ", this.step);
        if (step) {
            let current = DBotTree[step];
            if (current) {
                let block = this.checkEachBlockForMatch(current.children, message, step);
                if (block) {
                    return block;
                }
            }
        }
        return this.checkEachBlockForMatch(Object.keys(DBotTree), message);
    }

    clear() {
        this.step = undefined;
    }

    parseAction(message) {
        let action = {isValid: false, api: undefined, messages: []};
        let defaultStep = this.step;

        TLogs.p("---- Parse Action: ", this.step);
        /** MANAGE ENTER VALUE for last step **/
        if (this.step && DBotTree[this.step] && DBotTree[this.step].result.isEnd) {
            let value = this.finalActions[DBotTree[this.step].result.next](message);
            if (value && (!DBotTree[this.step].result.max || value <= DBotTree[this.step].result.max)) {
                action.name = DBotTree[this.step].id;
                action.isValid = true;
                action.api = DBotTree[this.step].result.action;
                action.value = value;
                this.step = undefined;
                return action;
            }
            defaultStep = DBotTree[this.step].requirements ? DBotTree[this.step].requirements.step : undefined;
        }

        TLogs.p("---- Parse Action: final step", this.step);
        let treeBlock = this.findTreeBlock(message, defaultStep);

        TLogs.p("Block found: ", treeBlock);
        if (treeBlock) {
            let result = treeBlock.result;
            action.isValid = true;
            action.name = treeBlock.id;
            if (!result.isEnd) {
                this.step = result.next;
                TLogs.p("new step is ", this.step, result);
                action.messages.push(result.response);
                let options = "";
                for (let i = 0; i < result.options.length; ++i) {
                    if (i !== 0) {
                        options += "\n";
                    }
                    options += result.options[i];
                }
                action.messages.push(options);
            } else {
                let value = this.finalActions[result.next](message);
                if (value && (!result.max || value <= result.max)) {
                    this.step = undefined;
                    action.api = result.action;
                    action.value = value;
                } else {
                    this.step = treeBlock.id;
                    action.messages.push(result.response);
                }
            }
        } else {
            action.messages.push("We were unable to understand your request");
        }
        return action;
    }
}

export default MsgInterpretation;