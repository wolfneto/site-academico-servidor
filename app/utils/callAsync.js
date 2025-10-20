module.exports = (app) => {

    this.tryAwait = async(untilGetResult) => {
        try {
            const data = await untilGetResult;
            return data;
        } catch (error) {
            return error;
        }
    }

    return this;
}