function loadFixedAssetsCategoryDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.Category]', Condition: 'WHERE IsDeleted =0' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'CategoryID' : inputID)), 'Select Category', selectedValue);
        }
    });
}
function loadFixedAssetsSubCategoryByCategoryDropdownList(inputID = null, selectedValue = 0, categoryID = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.SubCategory]', Condition: 'WHERE IsDeleted =0 AND CategoryID = ' + categoryID + '' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'SubCategoryID' : inputID)), 'Select Sub-category', selectedValue);
        }
    });
}
function loadFixedAssetsClassBySubCategoryDropdownList(inputID = null, selectedValue = 0, subCategoryID = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.Class]', Condition: 'WHERE IsDeleted =0 AND SubCategoryID = ' + subCategoryID + '' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'ClassID' : inputID)), 'Select Class', selectedValue);
        }
    });
}
function loadFixedAssetsSubClassByClassDropdownList(inputID = null, selectedValue = 0, classID = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.SubClass]', Condition: 'WHERE IsDeleted =0 AND ClassificationID = ' + classID + '' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'SubClassID' : inputID)), 'Select Sub-class', selectedValue);
        }
    });
}
function loadFixedAssetsDepreciationMethodDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.DepreciationMethod]', Condition: 'WHERE IsDeleted =0' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'DepreciationMethodID' : inputID)), 'Select Depreciation method', selectedValue);
        }
    });
}
function loadFixedAssetsPOStatusDropdownList(inputID = null, selectedValue = 0, selectedText) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.POStatus]', Condition: 'WHERE IsDeleted =0' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'POStatusID' : inputID)), 'Select Status', selectedValue, selectedText);
        }
    });
}
function loadFixedAssetsPIStatusDropdownList(inputID = null, selectedValue = 0, selectedText) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PIStatus]', Columns: 'ID Value, CASE WHEN Description = \'Posted\' THEN \'Post\' ELSE Description END AS Text', Condition: 'WHERE IsDeleted = 0 AND Description != \'Cancelled\'' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'PIStatusID' : inputID)), 'Select Status', selectedValue, selectedText);
        }
    });
}
function loadFixedAssetsPurchaseOrderDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[PurchaseOrderHeader]', Columns: 'ID Value, PONumber Text', Condition: 'WHERE IsDeleted =0' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'PurchaseOrderHeaderID' : inputID)), 'Select Purchase Order', selectedValue);
        }
    });
}
function loadFixedAssetsPurchaseOrderByStatusDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST',
        data: {
            Table: '[PurchaseOrderHeader] PO INNER JOIN [Setup.POStatus] POS ON POS.ID = PO.POStatusID',
            Columns: 'PO.ID Value, PO.PONumber Text',
            Condition: "WHERE POS.Description = 'Released' " + "AND PO.IsDeleted = 0 AND POS.IsDeleted = 0 " + "AND PO.CompanyID = " + companyID + " " + "AND (NOT EXISTS (SELECT 1 FROM PurchaseInvoiceHeader PI " + "WHERE PI.PurchaseOrderHeaderID = PO.ID " + "AND PI.CompanyID = " + companyID + " AND PI.IsDeleted = 0) " + "OR PO.ID = " + selectedValue + ")"
        },
        callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'PurchaseOrderHeaderID' : inputID)), 'Select Purchase Order', selectedValue);
        }
    });
}

function loadFixedAssetsClassificationDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.Class]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'ClassificationID' : inputID)), 'Select Class', selectedValue);
        }
    });
}
function loadFixedAssetsDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: '[dbo].[Assets]', Condition: 'WHERE IsDeleted = 0' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'AssetsID' : inputID)), 'Select Asset', selectedValue);
        }
    });
}
function loadFixedAssetsBatchDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get', type: 'POST', data: { Table: 'BHAERPInventorySuite.dbo.PrdProductItemTracking', Condition: 'WHERE IsActive = 1' }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'BatchID' : inputID)), 'Select Batch', selectedValue);
        }
    });
}
function loadFixedAssetsUOMDropdownList(inputID = null, selectedValue = 0) {
    ajaxRequest({
        url: '/ProductManagement/Product/GetUOMAll', type: 'POST', data: {}, callBack: function (responseJSON) {
            let itemsArray = [];
            if (typeof responseJSON === 'string') {
                responseJSON = JSON.parse(responseJSON);
            }
            responseJSON.forEach(item => {
                itemsArray.push({
                    value: item.ID,
                    text: item.Description
                });
            });
            bindJQueryDropdownList(responseJSON, $('#' + (inputID == null ? 'UOMID' : inputID)), 'Select UOM', selectedValue);
        }
    });
}
function loadFixedAssetsBySubClassificationDropdownList(inputID = null, selectedValue = 0, subClassificationID = 0) {
    let condition = 'WHERE IsDeleted = 0';
    if (subClassificationID > 0) { condition += ` AND SubClassID = ${subClassificationID}`; }
    ajaxRequest({
        url: '/FixedAssets/Dropdowns/Get',
        type: 'POST', data: { Table: '[dbo].[Assets]', Condition: condition }, callBack: function (responseJSON) {
            bindJQueryDropdownList(responseJSON.resultJSON, $('#' + (inputID == null ? 'AssetsID' : inputID)), 'Select Asset', selectedValue);
        }
    });
}