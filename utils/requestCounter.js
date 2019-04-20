class RequestCounter {

	constructor(requestLimit, requestInterval) {
		this.requestLimit = requestLimit;
		this.requestInterval = requestInterval * 24 * 60 * 60 * 1000; // interval in hours to milliseconds
		this.numRequests = 0;
		this.lastCheckPoint = Date.now();
	}

	canRequest(numRequestsToMake) {
		if (this.requestInterval < Date.now() - this.lastCheckPoint) {
			this.lastCheckPoint = Date.now();
			this.numRequests = 0;
		}
		if (this.numRequests + numRequestsToMake <= this.requestLimit) {
			return true;
		}
		return false;
	}

	makeRequest(numRequestsToMake) {
		this.numRequests += numRequestsToMake;
	}
}

module.exports = { RequestCounter }