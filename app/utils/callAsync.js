module.exports = (app) => {

this.tryAwait = async(untilGetResult) => {
try {
const data = await untilGetResult;
return data;
} catch (error) {
throw error;
}
}

return this;
}