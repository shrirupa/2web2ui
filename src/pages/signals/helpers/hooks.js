// JSON.stringify() does not guarantee the serialised order of object members.
export const comparableJson = (obj) => JSON.stringify(Object.keys(obj).sort().map((key) => ({ [key]: obj[key] })));
