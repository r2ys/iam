(function() {
    'use strict';

    function DeleteAupController($scope, $uibModalInstance, AupService) {
        var self = this;
        self.enabled = true;

        self.cancel = function() {
            $uibModalInstance.close();
        };

        self.doDeleteAup = function() {
            self.error = undefined;
            self.enabled = false;
            AupService.deleteAup()
                .then(function(res) {
                    $uibModalInstance.close('AUP deleted succesfully');
                    self.enabled = true;
                }).catch(function(res) {
                    self.error = res.data.error;
                    self.enabled = true;
                });
        };
    }

    function CreateAupController($scope, $uibModalInstance, AupService) {
        var self = this;
        self.enabled = true;

        self.cancel = function() {
            $uibModalInstance.close();
        };

        self.reset = function() {
            self.aupVal = {
                text: "AUP text...",
                signatureValidityInDays: 0
            };
        };

        self.reset();

        self.doCreateAup = function() {
            self.error = undefined;
            self.enabled = false;
            AupService.createAup(self.aupVal)
                .then(function(res) {
                    $uibModalInstance.close('AUP created succesfully');
                    self.enabled = true;
                }).catch(function(res) {
                    self.error = res.data.error;
                    self.enabled = true;
                });
        };
    }

    function AupController($rootScope, $uibModal, toaster, AupService) {
        var self = this;
        self.$onInit = function() {
            console.log('AupController onInit');
            self.loaded = true;
            console.info('Aup: ' + self.aup);
        };

        self.handleSuccess = function(msg) {
            if (msg != null) {
                toaster.pop({
                    type: 'success',
                    body: msg
                });
            }
            self.aup = AupService.getAup().then(function(res) {
                self.aup = res;
            });
        };

        self.openCreateAupDialog = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/resources/iam/js/dashboard-app/components/aup/aup.create.dialog.html',
                controller: CreateAupController,
                controllerAs: '$ctrl'
            });

            modalInstance.result.then(self.handleSuccess);
        };

        self.openDeleteAupDialog = function() {
            var modalInstance = $uibModal.open({
                templateUrl: '/resources/iam/js/dashboard-app/components/aup/aup.delete.dialog.html',
                controller: DeleteAupController,
                controllerAs: '$ctrl'
            });

            modalInstance.result.then(self.handleSuccess);
        };
    }

    angular.module('dashboardApp').component('aup', {
        templateUrl: '/resources/iam/js/dashboard-app/components/aup/aup.component.html',
        bindings: {
            aup: '<'
        },
        controller: [
            '$rootScope', '$uibModal', 'toaster',
            'AupService', AupController
        ]
    });
})();