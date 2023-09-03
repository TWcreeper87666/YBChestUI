import { world } from '@minecraft/server';
export class UIerror extends Error {
    constructor(name) {
        super();
        this.name = name;
        const source = [];
        if (!this.stack)
            return;
        for (const line of this.stack.split('\n')) {
            if (line && !line.includes('YBchestUI'))
                source.push(line);
        }
        this.stack = source.join('\n');
        world.sendMessage(`§cERROR! ${this.name}`);
    }
}
function checkType(expecteds, received) {
    for (const expected of expecteds) {
        if (typeof expected === 'string') {
            if (typeof received === expected)
                return true;
        }
        else {
            if (received instanceof expected)
                return true;
        }
    }
    return false;
}
export function checkTypes(name, args, types, min = types.length) {
    for (var idx = 0; idx < types.length; idx += 1) {
        var expecteds = (types[idx] instanceof Array) ? types[idx] : [types[idx]];
        var received = args[idx];
        if (received === undefined && idx >= min)
            continue;
        if (!checkType(expecteds, received)) {
            var msg = expecteds.map(v => v?.name ? v.name : v).join(' or ');
            throw new UIerror(`${name}的 參數${idx} 只接受類型${msg}`);
        }
    }
}
