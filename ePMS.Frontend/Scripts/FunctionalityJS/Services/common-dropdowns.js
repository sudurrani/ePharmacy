function loadProjectTypeDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectType]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Type', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadProjectCategoryDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectCategory]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Category', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadProjectStatusDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectStatus]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Status', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadProjectBillingMethodDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectBillingMethod]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Billing Method', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadProjectBillingCycleDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectBillingCycle]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Billing Cycle', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadProjectPaymentTermDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectPaymentTerm]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Payment Term', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadSubcontractorDropdownList(inputID, selectedValue = 0, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: 'Subcontractor', Columns: 'ID Value, Name Text',  Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Subcontractor', selectedValue, selectedText);
            }
        }
    });
}
function loadEstimationUnitDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectTimeUnit]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Completion Time', selectedValue, selectedText, addNewOption);
            }
        }
    });
}

function loadSubcontractorServiceGroupDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.SubcontractorServiceGroup]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Group', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadSubcontractorBusinessTypeDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.SubcontractorBusinessType]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Business Type', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadServiceLineDropdownList(inputID, selectedValue = 0, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {Table: '[Setup.ServiceLine]', Columns: "ID Value, Description Text", Condition:'WHERE IsDeleted = 0'
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {                
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Line', selectedValue,selectedText);
            }
        }
    });
}
function loadServiceGroupDropdownList(inputID, selectedValue = 0, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceGroup]', Columns: "ID Value, Description Text", Condition: 'WHERE IsDeleted = 0'
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Line', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceCategoryDropdownList(inputID, selectedValue = 0, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceCategory]', Columns: "ID Value, Description Text", Condition: 'WHERE IsDeleted = 0'
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Category', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceBillingUnitDropdownList(inputID, selectedValue = 0, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceBillingUnit]', Columns: "ID Value, Description Text", Condition: 'WHERE IsDeleted = 0'
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Bill', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceRateTypeDropdownList(inputID, selectedValue = 0, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceRateType]', Columns: "ID Value, Description Text", Condition: 'WHERE IsDeleted = 0'
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Rate Type', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceLineByDivisionDropdownList(inputID, selectedValue = 0, divisionID, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceLine]', Columns: "ID Value, Description Text", Condition: 'WHERE IsDeleted = 0 And DivisionID = ' + divisionID + ''
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Line', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceGroupByServiceLineDropdownList(inputID, selectedValue = 0, serviceLineID, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceGroup]', Columns: "ID Value, Description Text", Condition: 'WHERE IsDeleted = 0 And ServiceLineID = ' + serviceLineID + ''
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Group', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceCategoryByServiceGroupDropdownList(inputID, selectedValue = 0, serviceGroupID, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceCategory]', Columns: "ID Value, Description Text", Condition: 'WHERE IsDeleted = 0 And ServiceGroupID = ' + serviceGroupID + ''
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Category', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceSubcategoryDropdownList(inputID, selectedValue = 0, serviceCategoryID, selectedText = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: '[Setup.ServiceSubcategory]', Columns: "ID Value, Name Text", Condition: 'WHERE IsDeleted = 0 And ServiceCategoryID = ' + serviceCategoryID + ''
        },
        callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Sub category', selectedValue, selectedText);
            }
        }
    });
}
function loadServiceTypeDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ServiceType]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Type', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadServiceChargeBasisDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ServiceChargeBasis]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Service Charge', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadServiceUoMDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ServiceUoM]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select UoM', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadProjectTimeUnitDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ProjectTimeUnit]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Duration Unit', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadServiceItemQuotationStatusDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ServiceItemQuotationStatus]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Quotation Status', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
function loadServiceItemQuotationPaymentTermDropdownList(inputID, selectedValue = 0, selectedText = null, addNewOption = null) {
    ajaxRequest({
        url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ServiceItemQuotationPaymentTerm]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess) {
                bindJQueryDropdownList(responseJSON.resultJSON, $('#' + inputID), 'Select Quotation Payment Term', selectedValue, selectedText, addNewOption);
            }
        }
    });
}
