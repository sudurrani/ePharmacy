var saveUnitFeturesCallBack = function () {

}
function prepareUnitFeaturesData() {
    var unitFeaturesArray = [];

    for (let count = 1; count <= totalFeaturesCount; count++) {
        var unitFeatureObject = { 'ID': 0, UnitID: '', FeatureID: '', FeatureInput: '' };
        if ($('#unitFeatureCheckbox' + count).is(':checked')) {
            //unitFeatureObject.UnitID = $('#UnitID').val();
            var inputID = '#unitFeatureIDInput' + '' + count;
            var featureInputID = '#unitFeatureInput' + '' + count;
            unitFeatureObject.FeatureID = $(inputID).val();
            unitFeatureObject.FeatureInput = $(featureInputID).val();

            unitFeaturesArray.push(unitFeatureObject);
        }
    }
    return unitFeaturesArray;
}
function setUnitFeaturesByUnitID(features, unitID = 0, propertyID = 0) {
    unitID = unitID == 0 ? $('#ID').val() : unitID;
    addedUnitFeaturesArray = [];
    var object = {};
    $.each(features, function (rowIndex, rowItem) {
        if (rowIndex == 0) {
            object['UnitFeaturesID'] = rowItem.UnitFeaturesID;
            object['UnitFeaturesUnitNo'] = rowItem.UnitNo;
            object['UnitFeaturesArea'] = rowItem.Area;
            object['UnitFeaturesBathrooms'] = rowItem.Bathroom;
            object['UnitFeaturesBedrooms'] = rowItem.Bedroom;
            object['UnitFeaturesKitchens'] = rowItem.Kitchen;
            object['UnitFeaturesFeatures'] = JSON.parse(rowItem.FeatureID);
            object['FeaturesText'] = rowItem.FeaturesText;
            object['TypeWithChild'] = rowItem.PropertyStructureTypeID;
            object['UnitFeaturesComments'] = rowItem.Comments;
            addedUnitFeaturesArray.push(object);
        }
    });
    if (addedUnitFeaturesArray.length > 0) {
        let propertyStructureID = addedUnitFeaturesArray[0].TypeWithChild;
        setResponseToFormInputs(object, ['TypeWithChild']);

        loadTypeWithChildDropdownList(propertyStructureID, propertyID);
        $('#TypeWithChild').attr('disabled', true);
        getPropertyStructureUnitTypeAndCount(propertyStructureID);
    }
}    

function getUnitFeaturesByUnitID(unitID = 0, propertyID = 0) {
    unitID = unitID == 0 ? $('#ID').val() : unitID;
    ajaxRequest({
        url: "/RealEstate/UnitFeatures/GetByUnitID", type: 'POST', data: { unitID: unitID, typeID: $('#TypeWithChild').val() }, callBack: function (responseJSON) {
            addedUnitFeaturesArray = [];
            var object = {};
            $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
                if (rowIndex == 0) {
                    object['UnitFeaturesID'] = rowItem.UnitFeaturesID;
                    object['UnitFeaturesUnitNo'] = rowItem.UnitNo;
                    object['UnitFeaturesArea'] = rowItem.Area;
                    object['UnitFeaturesBathrooms'] = rowItem.Bathroom;
                    object['UnitFeaturesBedrooms'] = rowItem.Bedroom;
                    object['UnitFeaturesKitchens'] = rowItem.Kitchen;
                    object['UnitFeaturesFeatures'] = JSON.parse(rowItem.FeatureID);
                    object['FeaturesText'] = rowItem.FeaturesText;
                    object['TypeWithChild'] = rowItem.PropertyStructureTypeID;
                    object['UnitFeaturesComments'] = rowItem.Comments;
                    addedUnitFeaturesArray.push(object);
                }
            });
            if (addedUnitFeaturesArray.length > 0) {
                let propertyStructureID = addedUnitFeaturesArray[0].TypeWithChild;
                setResponseToFormInputs(object, ['TypeWithChild']);

                loadTypeWithChildDropdownList(propertyStructureID, propertyID);
                getPropertyStructureUnitTypeAndCount(propertyStructureID);
            }
        }
    });
}

function getUnitFeatures() {
    ajaxRequest({ url: "/RealEstate/UnitFeatures/GetAll", type: 'POST', data: {}, callBack: getUnitFeaturesCallBack });

}

var getUnitFeaturesCallBack = function (responseJSON) {
    isUnitFeatureLoaded = true;
    totalFeaturesCount = responseJSON.resultJSON.length;
    $('#unitFeaturesForm-Container').html('');
    $.each(responseJSON.resultJSON, function (index, object) {
        IsUnitFeatureLoaded = true;
        var unitFeatureCheckbox = 'unitFeatureCheckbox' + (index + 1);
        var unitFeatureInput = 'unitFeatureInput' + (index + 1);
        var unitFeatureIDInput = 'unitFeatureIDInput' + (index + 1);
        var html = '';
        if (object.IsInputRequired) {
            html = `<div class="row">
                            <input type="hidden" id="`+ unitFeatureIDInput + `" value="` + object.ID + `"/>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label class="label">
                                        <span class="text-black-50">
                                            `+ object.Description + `
                                        </span>
                                        <!--<span class="text-danger">
                                            *
                                        </span>-->
                                    </label>

                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="custom-control custom-checkbox custom-control-inline col-md-7">
                                    <input type="checkbox" class="custom-control-input" name="`+ unitFeatureCheckbox + `" id="` + unitFeatureCheckbox + `" />
                                    <label class="custom-control-label" for="`+ unitFeatureCheckbox + `"></label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <input type="text" class="form-control" name="`+ unitFeatureInput + `" id="` + unitFeatureInput + `"/>
                            </div>
                         </div>`
        }
        else {
            html = `<div class="row">
                            <input type="hidden" id="`+ unitFeatureIDInput + `" value="` + object.ID + `"/>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label class="label">
                                        <span class="text-black-50">
                                            `+ object.Description + `
                                        </span>
                                        <!--<span class="text-danger">
                                            *
                                        </span>-->
                                    </label>

                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="custom-control custom-checkbox custom-control-inline col-md-4">
                                    <input type="checkbox" class="custom-control-input" name="`+ unitFeatureCheckbox + `" id="` + unitFeatureCheckbox + `" />
                                    <label class="custom-control-label" for="`+ unitFeatureCheckbox + `"></label>
                                </div>
                            </div>
                         </div>`
        }
        $('#unitFeaturesForm-Container').append(html);
    });

}


function loadPropertyTypeDropdownList() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PropertyType]' }, callBack: loadPropertyTypeDropdownListCallBack });
}

var typeWithChildSelectedValue = 0;
function loadTypeWithChildDropdownList(selectedValue = 0, propertyID = 0) {
    typeWithChildSelectedValue = selectedValue;
    ajaxRequest({ url: '/RealEstate/PropertyStructure/GetTypeWithChildByPropertyID', type: 'POST', data: { propertyID: propertyID }, callBack: loadTypeWithChildDropdownListCallBack }, null, false);
}
var loadTypeWithChildDropdownListCallBack = function (responseJSON) {
    bindJQueryHierarchicalDropdownList(responseJSON.resultJSON, $('#TypeWithChild'), 'Select Type', typeWithChildSelectedValue);
}
//function getPropertyStructureUnitTypeAndCount(propertyStrucutreID = 0) {    
//    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyStructure]', Columns: 'UnitTypeCount Value, UnitTypeName Text', Condition: 'WHERE IsDeleted = 0 AND ID = ' + propertyStrucutreID }, callBack: getPropertyStructureUnitTypeAndCountCallBack });    
//}
//var getPropertyStructureUnitTypeAndCountCallBack = function (responseJSON) {
//    $('#AvailableCountAddButtonContainer').css('display', 'block');
//    $('#spanType').text(' ' + responseJSON.resultJSON[0].Text)
//    $('#spanTypeCount').text('  ' + responseJSON.resultJSON[0].Value)


//    $('#YetToBeAddedCountAddButtonContainer').css('display', 'block');
//    $('#spanYetToBeAddedTypeCount').text(' ' + responseJSON.resultJSON[0].Value);
//    $('#spanYetToBeAddedType').text(' ' + responseJSON.resultJSON[0].Text)
//}

function openAddNewUnitModal() {
    $('#AddNewUnitModal').modal('show');
}
//function addNewUnitFromModal() {
//    if (customValidateForm('popupAddUnitTypeDetailForm')) {
//        var addedUnitFeatureJSONObject = getFormDataAsJSONObject('popupAddUnitTypeDetailForm');
//        var featuresString = '';
//        $.each($('#UnitFeaturesFeatures').val(), function (rowIndex, rowItem) {
//            var feature = _unitFeaturesArray.find(row => row.Value == rowItem);
//            featuresString = featuresString == '' ? feature.Text : featuresString == undefined ? feature.Text : featuresString + ', ' + feature.Text;
//        });
//        addedUnitFeatureJSONObject['FeaturesText'] = featuresString;
//        addedUnitFeatureJSONObject['PropertyStructureTypeID'] = $('#TypeWithChild').val();
//        if (isUnitFeatureUnitTypeUpdate) {
//            var removedObject = addedUnitFeaturesArray.splice(unitFeaturesModifyingRecordIndex, 1);
//            addedUnitFeatureJSONObject.ID = removedObject[0].ID;
//            addedUnitFeaturesArray.splice((unitFeaturesModifyingRecordIndex), 0, addedUnitFeatureJSONObject)

//        }
//        else {
//            addedUnitFeaturesArray.push(addedUnitFeatureJSONObject);
//        }

//        generateHTMLTableRowsFromJSON(addedUnitFeaturesArray, 'addNewUnitTable', null, null, 'UnitFeaturesID', 1);
//        $('#popupAddUnitTypeDetailForm')[0].reset();
//        $('#UnitFeaturesFeatures').val(null);
//        $('#UnitFeaturesFeatures').change();
//        $('#AddNewUnitModal').modal('hide');
//        isUnitFeatureUnitTypeUpdate = false;

//        //subtract added type from Yet to be addd count
//       //debugger;
//        var yetToBeAddedCount = parseInt($('#spanTypeCount').text());
//        yetToBeAddedCount = yetToBeAddedCount - addedUnitFeaturesArray.length;
//        $('#spanYetToBeAddedTypeCount').text(' ' + yetToBeAddedCount);
//        if (yetToBeAddedCount <= 0) {
//            $('#btnOpenAddUnitTypeModal').prop('disabled', true);
//        }
//        else {
//            $('#btnOpenAddUnitTypeModal').prop('disabled', false);
//        }
//    }
//}
function addNewUnitFromModal() {
    if (customValidateForm('popupAddUnitTypeDetailForm')) {
        var addedUnitFeatureJSONObject = getFormDataAsJSONObject('popupAddUnitTypeDetailForm');

        var featuresString = '';
        $.each($('#UnitFeaturesFeatures').val(), function (rowIndex, rowItem) {
            var feature = _unitFeaturesArray.find(row => row.Value == rowItem);
            featuresString = featuresString == '' ? feature.Text : featuresString == undefined ? feature.Text : featuresString + ', ' + feature.Text;
        });
        addedUnitFeatureJSONObject['FeaturesText'] = featuresString;
        //addedUnitFeatureJSONObject['PropertyStructureTypeID'] = $('#TypeWithChild').val();
        if (isUnitFeatureUnitTypeUpdate) {
            var removedObject = addedUnitFeaturesArray.splice(unitFeaturesModifyingRecordIndex, 1);
            addedUnitFeatureJSONObject.UnitFeaturesID = removedObject[0].UnitFeaturesID;
            addedUnitFeatureJSONObject['PropertyStructureTypeID'] = removedObject[0].PropertyStructureTypeID;
            addedUnitFeaturesArray.splice((unitFeaturesModifyingRecordIndex), 0, addedUnitFeatureJSONObject)

        }
        else {
            addedUnitFeatureJSONObject['PropertyStructureTypeID'] = $('#TypeWithChild').val();
            addedUnitFeaturesArray.push(addedUnitFeatureJSONObject);
        }

        generateHTMLTableRowsFromJSON(addedUnitFeaturesArray, 'addNewUnitTable', null, null, 'UnitFeaturesID', 1);
        $('#popupAddUnitTypeDetailForm')[0].reset();
        $('#UnitFeaturesFeatures').val(null);
        $('#UnitFeaturesFeatures').change();
        $('#AddNewUnitModal').modal('hide');
        isUnitFeatureUnitTypeUpdate = false;

        //subtract added type from Yet to be addd count
        //debugger;
        var yetToBeAddedCount = parseInt($('#spanTypeCount').text());
        yetToBeAddedCount = yetToBeAddedCount - addedUnitFeaturesArray.length;
        $('#spanYetToBeAddedTypeCount').text(' ' + yetToBeAddedCount);
        if (yetToBeAddedCount <= 0) {
            $('#btnOpenAddUnitTypeModal').prop('disabled', true);
        }
        else {
            $('#btnOpenAddUnitTypeModal').prop('disabled', false);
        }
    }
}
//function deleteRecord(id = 0, rowIndex = 0) {

//    swal.fire({
//        title: swalConfirmTitle,
//        type: "warning",
//        text: swalConfirmText,
//        showCancelButton: true,
//        confirmButtonText: swalConfirmButtonText,
//        cancelButtonText: swalConfirmCancelButtonText,
//        closeOnConfirm: false,
//        closeOnCancel: true
//    }).then(
//        function (isConfirm) {
//            var removedUnitFeaturesArray = addedUnitFeaturesArray.splice(rowIndex, 1);
//            generateHTMLTableRowsFromJSON(addedUnitFeaturesArray, 'addNewUnitTable', null, null, 'UnitFeaturesID', 1);
//            //subtract added type from Yet to be addd count
//            var yetToBeAddedCount = parseInt($('#spanTypeCount').text());
//            $('#spanYetToBeAddedTypeCount').text(' ' + (yetToBeAddedCount - addedUnitFeaturesArray.length));
//            if (yetToBeAddedCount <= 0) {
//                $('#btnOpenAddUnitTypeModal').prop('disabled', true);
//            }
//            else {
//                $('#btnOpenAddUnitTypeModal').prop('disabled', false);
//            }
//        });
//}
function modifyRecord(id = 0, rowIndex = 0) {
    var addedUnitFeatureObject = addedUnitFeaturesArray[rowIndex];
    setResponseToFormInputs(addedUnitFeatureObject);
    $('#AddNewUnitModal').modal('show');
    isUnitFeatureUnitTypeUpdate = true;
    unitFeaturesModifyingRecordIndex = rowIndex;

}
function closeAddNewUnitModal() {
    $('#AddNewUnitModal').modal('hide');
    isUnitFeatureUnitTypeUpdate = false;
    unitFeaturesModifyingRecordIndex = -1;
}



//\\\\\\\\\\\\\\\\\\\\\\\\\
function getPropertyStructureUnitTypeAndCount(propertyStrucutreID = 0) {
    //ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[PropertyStructure]', Columns: 'UnitTypeCount Value, UnitTypeName Text', Condition: 'WHERE IsDeleted = 0 AND ID = ' + propertyStrucutreID }, callBack: getPropertyStructureUnitTypeAndCountCallBack });
    if (propertyStrucutreID > 0 && propertyStrucutreID != "0") {
        ajaxRequest({ url: '/RealEstate/UnitFeatures/GetYetToBeAddedByPropertyStructureID', type: 'POST', data: { propertyStructureID: propertyStrucutreID }, callBack: getPropertyStructureUnitTypeAndCountCallBack });
    }
    else {
        $('#AvailableCountAddButtonContainer').css('display', 'none');
        $('#YetToBeAddedCountAddButtonContainer').css('display', 'none');
    }
}
var getPropertyStructureUnitTypeAndCountCallBack = function (responseJSON) {
    $('#AvailableCountAddButtonContainer').css('display', 'block');
    $('#spanType').text(' ' + responseJSON.resultJSON.UnitType)
    $('#spanTypeCount').text('  ' + responseJSON.resultJSON.TotalAvailable)


    $('#YetToBeAddedCountAddButtonContainer').css('display', 'block');
    $('#spanYetToBeAddedTypeCount').text(' ' + responseJSON.resultJSON.YetToBeAdded);
    $('#spanYetToBeAddedType').text(' ' + responseJSON.resultJSON.UnitType)
    //getUnitFeaturesByUnitID();

}
/*
function getUnitFeaturesPropertyStructureID(unitID = 0) {
    ajaxRequest({ url: '/RealEstate/Unit/GetUnitFeaturesPropertyStructurByUnitID', type: 'POST', data: { ID: unitID }, callBack: getUnitFeaturesPropertyStructureIDCallBack }, null, false);
}
var getUnitFeaturesPropertyStructureIDCallBack = function (responseJSON) {        
    let propertyStructureID = responseJSON.resultJSON == null ? 0 : responseJSON.resultJSON.ID;
    
    //alert('propertyStructureID' + propertyStructureID);
    loadTypeWithChildDropdownList(propertyStructureID);
    getPropertyStructureUnitTypeAndCount(propertyStructureID);
    
}
*/

function deleteRecord(id = 0, rowIndex = 0) {

    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: swalConfirmText,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (id > 0) {
                ajaxRequest({ url: '/RealEstate/UnitFeatures/DeleteUnitFeature', type: 'POST', data: { ID: id }, callBack: deleteUnitFeatureCallBack });
            }
            var removedUnitFeaturesArray = addedUnitFeaturesArray.splice(rowIndex, 1);
            generateHTMLTableRowsFromJSON(addedUnitFeaturesArray, 'addNewUnitTable', null, null, 'UnitFeaturesID', 1);
            //subtract added type from Yet to be addd count
            var yetToBeAddedCount = parseInt($('#spanTypeCount').text());
            $('#spanYetToBeAddedTypeCount').text(' ' + (yetToBeAddedCount - addedUnitFeaturesArray.length));
            if (yetToBeAddedCount <= 0) {
                $('#btnOpenAddUnitTypeModal').prop('disabled', true);
            }
            else {
                $('#btnOpenAddUnitTypeModal').prop('disabled', false);
            }
        });
}
deleteUnitFeatureCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {

        successToastr(responseJSON.Message, 'success');
    }
    else {
        errorToastr(responseJSON.Message, 'error');

    }
}


