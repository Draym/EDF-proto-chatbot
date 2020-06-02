let DBotTree = {
    period1: {
        id: "period1",
        filters: {primary: "period", secondary: ["one", "1"], opt: ["periodone", "period1"]},
        result: {
            response: "What action do you want to do on period one ?",
            options: ["1) Set START heating ?", "2) Set END heating ?", "3) Set POINT heating ?"],
            next: "period1",
            isEnd: false
        },
        children: ["period1start", "period1end", "period1point"]
    },
    period2: {
        id: "period2",
        filters: {primary: "period", secondary: ["two", "2"], opt: ["periodtwo", "period2"]},
        result: {
            response: "What action do you want to do on period two ?",
            options: ["1) Set START heating ?", "2) Set END heating ?", "3) Set POINT heating ?"],
            next: "period2",
            isEnd: false
        },
        children: ["period2start", "period2end", "period2point"]
    },
    idle: {
        id: "idle",
        filters: {primary: "idle", secondary: []},
        result: {
            response: "Enter the idle value: (double)",
            next: "enterDouble",
            isEnd: true,
            action: "setIdleTemperature"
        }
    },
    point: {
        id: "point",
        filters: {primary: "point", secondary: []},
        result: {
            response: "Enter the point value: (double)",
            next: "enterDouble",
            isEnd: true,
            action: "setSetPoint"
        }
    },
    period1start: {
        id: "period1start",
        requirements: {step: "period1"},
        filters: {primary: "start", secondary: []},
        result: {
            response: "Enter the start period value for period one: (double)",
            next: "enterDouble",
            max: 24,
            isEnd: true,
            action: "setHeatingPeriodOneSetStart"
        }
    },
    period1end: {
        id: "period1end",
        requirements: {step: "period1"},
        filters: {primary: "end", secondary: []},
        result: {
            response: "Enter the end period value for period one: (double)",
            next: "enterDouble",
            max: 24,
            isEnd: true,
            action: "setHeatingPeriodOneSetEnd"
        }
    },
    period1point: {
        id: "period1point",
        requirements: {step: "period1"},
        filters: {primary: "point", secondary: []},
        result: {
            response: "Enter the SetPoint value for period one: (integer)",
            next: "enterInt",
            isEnd: true,
            action: "setHeatingPeriodOneSetPoint"
        }
    },
    period2start: {
        id: "period2start",
        requirements: {step: "period2"},
        filters: {primary: "start", secondary: []},
        result: {
            response: "Enter the start period value for period two: (double)",
            next: "enterDouble",
            max: 24,
            isEnd: true,
            action: "setHeatingPeriodTwoSetStart"
        }
    },
    period2end: {
        id: "period2end",
        requirements: {step: "period2"},
        filters: {primary: "end", secondary: []},
        result: {
            response: "Enter the end period value for period two: (double)",
            next: "enterDouble",
            max: 24,
            isEnd: true,
            action: "setHeatingPeriodTwoSetEnd"
        }
    },
    period2point: {
        id: "period2point",
        requirements: {step: "period2"},
        filters: {primary: "point", secondary: []},
        result: {
            response: "Enter the SetPoint value for period two: (integer)",
            next: "enterInt",
            isEnd: true,
            action: "setHeatingPeriodTwoSetPoint"
        }
    }
};

export default DBotTree;