function getByPropertyID(isCloseAndSaveAsDraft = false) {
  
    ajaxRequest({ url: "/RealEstate/Property/GetByPropertyID", type: 'POST', data: { propertyID: $('#PropertyID').val(), ID: $('#ID').val() }, callBack: getByPropertyIDCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft});
}
var getByPropertyIDCallBack = function (responseJSON, options) {
    if (responseJSON.IsSuccess) {
        if (responseJSON.resultJSON.length > 0) {
            infoToastr('Property ID (' + $('#PropertyID').val() + ') already exist', 'info');
        }
        else {            
            var propertyStructureArray = getAddedPropertyStructure();            
            var inputJSON = getFormDataAsJSONObject('propertyForm');
            inputJSON = getFormDataAsJSONObject('propertyLocationandNeighborhoodForm', inputJSON);
            inputJSON = getFormDataAsJSONObject('searchCoordinatesForm', inputJSON);
            inputJSON = getFormDataAsJSONObject('searchMakaniForm', inputJSON);
            inputJSON['PropertyStructure'] = propertyStructureArray;// JSON.stringify($('#tblPropertyStructureContainer').html());
            //inputJSON['FKeyIdentifier'] = fKeyIdentifierVal;
            inputJSON['FKeyIdentifier'] = $('#UnitUniqueFKeyIdenfier').val();
            inputJSON['BankAccountID'] = $('#BankAccountID').val();
            inputJSON['AccountType'] = $('#AccountType').val();
            inputJSON['ParkingNumbers'] = parkingNumbersArray;
            inputJSON['PropertyBankAccounts'] = _bankAccountsArray;
            ajaxRequest({ url: "/RealEstate/Property/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: options.isCloseAndSaveAsDraft });
        }
    }
    else {
        return 'error';
    }
}

function getOwnerDetail(ID) {
    try {
        ajaxRequest({ url: "/RealEstate/PropertyOwner/GetByID", type: 'POST', data: { ID: ID }, callBack: getOwnerDetailCallBack });
    }
    catch (err) {
        errorToastr(err.toString(), "error");
    }
}
var getOwnerDetailCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#PrimaryContactNumber').val(responseJSON.resultJSON.Landlord.PrimaryContactNumber);
        $('#SecondaryContactNumber').val(responseJSON.resultJSON.Landlord.SecondaryContactNumber);
    }
    else {
        errorToastr(responseJSON.Message, "error");
    }
}