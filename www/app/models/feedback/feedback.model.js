var app;
(function (app) {
    var models;
    (function (models) {
        var feedback;
        (function (feedback) {
            var Feedback = (function () {
                function Feedback(obj) {
                    if (obj === void 0) { obj = {}; }
                    console.log('Feedback Model instanced');
                    this.id = obj.id;
                    this.uid = obj.uid || app.core.util.functionsUtil.FunctionsUtilService.generateGuid();
                    this.nextCountry = obj.nextCountry || '';
                }
                Object.defineProperty(Feedback.prototype, "Id", {
                    get: function () {
                        return this.id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feedback.prototype, "Uid", {
                    get: function () {
                        return this.uid;
                    },
                    set: function (uid) {
                        if (uid === undefined) {
                            throw 'Please supply next country uid';
                        }
                        this.uid = uid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feedback.prototype, "NextCountry", {
                    get: function () {
                        return this.nextCountry;
                    },
                    set: function (nextCountry) {
                        if (nextCountry === undefined) {
                            throw 'Please supply next country';
                        }
                        this.nextCountry = nextCountry;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Feedback;
            }());
            feedback.Feedback = Feedback;
        })(feedback = models.feedback || (models.feedback = {}));
    })(models = app.models || (app.models = {}));
})(app || (app = {}));
//# sourceMappingURL=feedback.model.js.map