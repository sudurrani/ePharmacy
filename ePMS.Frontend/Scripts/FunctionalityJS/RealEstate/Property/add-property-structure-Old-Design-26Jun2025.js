var propertyStructureTypesArray = [];
var unitSegmentArray = [];
var propertyStructureUnitTypeArray = [];



$(function () {
    loadPropertyStructureTypeDropdownList();
    getPropertyStructureUnitSegments();   

    $('#btnAddPropertyStructureType').click(function () {

        var selectectedFloorType = $('#PropertyStructureType').val();
        if (selectectedFloorType == '') {
            infoToastr("First select one or more Floor Type(s)", 'info');
           
        }
        else {
            loadPropertyStructureTypes($('#PropertyStructureType').val());
        }
       
        
    })
    $('#demo_02').on('click', 'tr', function (event) {
      
        var typeID = parseInt($(this).find('td.tdTypeID').text())
        var parentID = parseInt($(this).find('td.parentID').text())       
        $('#demo_02 tr').each(function (rowIndex) {
            if (parseInt(typeID) == parseInt($(this).find('td.parentID').text()) && parentID == 0) {
                $(this).addClass('selected');
            }

        });
    });
    $('body').on('change', 'td.tdUnitSegment select', function (e) {       
        var closestRow = $(this).closest('tr');
        let unitTypeTd = closestRow.find('td.tdUnitType select');        
        getPropertyStructureUnitType($(this).val(), unitTypeTd);          
        
        //| Show hide Add Parking Numbers button
        if ($(this).find('option:selected').text() != 'Parking') {
            closestRow.find('td.tdAction').find('.span-btnAdParkingNumbers').css('display', 'none');
        }
        else {
            closestRow.find('td.tdAction').find('.span-btnAdParkingNumbers').css('display', 'inline');
        }
        //| Show hide Add Parking Numbers button
    });
   
});
function addTypeRow(requestedRow) {
    /*
    <button type='button' class='btn  btn-sm btn-primary btnAddSubType' onclick="addSubTypeRow(this);" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-plus'></i></b></button>                                
    */
    $('#coverScreen').show();
    var propertyStructureUnitSegmentDDL = loadUnitSegmentDropdownList(0);
    var propertyStructureUnitTypeDDL = loadPropertyStructureUnitTypetDropdownList();

    var insertAfterRow = $(requestedRow).closest('tr');
    var nextRowAfterCurrent = $(requestedRow).closest('tr').next('tr');
    var inputValue = $(insertAfterRow).find('input').val();
    var typeID = $(insertAfterRow).find('td.tdTypeID').text();
    var typeName = $(insertAfterRow).find('td.tdType').text();
    if (inputValue != null && inputValue != undefined && inputValue != '' && parseInt(inputValue) > 0) {
        //$('.' + typeName + 'Child').remove();
        //for (var rowIndex = inputValue; rowIndex > 0; rowIndex--) {
        for (var rowIndex = 1; rowIndex <= inputValue; rowIndex++) {
            let parkingParkingFKeyVal = new Date().getYYYYMMDDHHMMSSMS();
            
            var subTypeName = typeName + ' ' + parseInt(rowIndex);
            if (subTypeName.trim() == $(nextRowAfterCurrent).find('td.subTypeName').text().trim()) {
            }
            else {
                var insertingRow = `<tr class="` + typeName.replace(/\s/g, '') + `Child">
                    <td style="padding-top: 0.4rem;
                                    padding-bottom: 0.4rem;
                                    padding-left: 0px;
                                    padding-right: 0px;
                                    width: 20px;
                                    background-image: url('../../../../content/assets/img/drag-green.png'); background-repeat:no-repeat;
                                    background-position:center;"></td>
                                    <td class="select_handle"></td>
                             <td class="tdID select_handle" hidden>`+ 0 + `</td>
                             <td></td>
                             <td class="tdParkingFKey" hidden>`+ parkingParkingFKeyVal +`</td>
                             <td class="tdTypeID select_handle" hidden>`+ typeID + `</td>
                             <td class="tdCode select_handle"><input type="text" placeholder="Code" class="form-control form-control-sm" name="Code" id="Code" min="1" maxlength="3" /></td>
                               <td class='subTypeName select_handle'>`+ typeName + ` ` + parseInt(rowIndex) + `</td>
                             <td class='parentID select_handle' hidden>`+ typeID + `</td>
                             <td class='tdUnitSegment select_handle'id="Unitsegmenttd">`+ propertyStructureUnitSegmentDDL + `</td>
                             <td class='tdUnitType select_handle'><select class="form-control form-control-sm select2"></select></td>
                             <td class='tdUnitTypeCount select_handle'><input type="number" placeholder="Unit Type Count" class="form-control form-control-sm" value="`+ 0 + `" /></td>
                            <td class='tdAction'>
                                
                                <span class='red-tooltip span-btnAddSubTypeRow' data-toggle='tooltip' title='Add sub row'>
                                    <button type='button' class='btn  btn-sm btn-primary btnAddSubType' onclick="addSubTypeRow(this);" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;"><b><i class='icon s7-plus'></i></b></button>
                                    </span>
                                    <span class='red-tooltip span-btnAdParkingNumbers' data-toggle='tooltip' title='Add parking name(s)' style='display:none;'>
                                    <button type='button' class='btn bg-info btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="addParkingName(this);">
                                    <i class='fa fa-parking' style='padding:0;color:#fff;'></i>
                                    </button>
                                    </span>
                                    <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                                        <button type='button' class='btn bg-danger btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="removeTypeRowChild($(this));"');>
                                            <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                                        </button>
                                    </span>

                            </td>
                            <td></td>
                            </tr>`;
                $(insertingRow).insertAfter(insertAfterRow);                
                addTableDnd();

            }
            insertAfterRow = $(insertAfterRow).closest('tr').next('tr');
            nextRowAfterCurrent = $(nextRowAfterCurrent).closest('tr').next('tr');
        }
    }
    else {
        infoToastr('Type count is required', 'info');

    }
    $('#coverScreen').hide();
    
}
function addSubTypeRow(requestedRow) {
    $('#coverScreen').show();
    var propertyStructureUnitSegmentDDL = loadUnitSegmentDropdownList(0);
    var propertyStructureUnitTypeDDL = loadPropertyStructureUnitTypetDropdownList(0);

    var insertAfterRow = $(requestedRow).closest('tr');
    var inputValue = $(insertAfterRow).find('input').val();
    var typeName = $(insertAfterRow).find('td.tdType').text();
    var subTypeName = $(insertAfterRow).find('td.subTypeName').text();
    //if (inputValue != null && inputValue != undefined && inputValue != '' && parseInt(inputValue) > 0) {
    //$('.' + typeName + 'Child').remove();
    for (var rowIndex = 1; rowIndex > 0; rowIndex--) {
        let parkingParkingFKeyVal = new Date().getYYYYMMDDHHMMSSMS();
        var insertingRow = `<tr class="` + subTypeName + `Child">
                                        <td style="padding-top: 0.4rem;
                                    padding-bottom: 0.4rem;
                                    padding-left: 0px;
                                    padding-right: 0px;
                                    width: 20px;
                                    background-image: url('../../../../content/assets/img/drag-green.png'); background-repeat:no-repeat;
                                    background-position:center;"></td>
                                    <td class="select_handle"></td>
                                               <td class='tdID select_handle' hidden>0</td>
                                               <td></td>
                                               <td class="tdParkingFKey" hidden>`+ parkingParkingFKeyVal +`</td>
                                               <td class='parentID select_handle' hidden>`+ $(insertAfterRow).find('td.parentID').text() + `</td>
                                               <td class="tdCode select_handle"><input type="text" placeholder="Code" class="form-control form-control-sm" name="Code" id="Code" min="1" maxlength="3" /></td>
                                               <td style='' class='subTypeChildName select_handle'>`+ subTypeName + `</td>
                                               <td class='tdUnitSegment select_handle'>`+ propertyStructureUnitSegmentDDL + `</td>

                                               <td class='tdUnitType select_handle'><select class="form-control form-control-sm select2"></select></td>
                                               <td class='tdUnitTypeCount select_handle'><input type="number" placeholder="Unit Type Count" class="form-control form-control-sm" value="0" /></td>
                                               <td>
                                                    <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                                                            <button type='button' class='btn bg-danger btn-sm' style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;" onclick="removeSubTypeRow($(this));">
                                                            <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                                                    </button>
                                                    </span>                                                    
                                               </td>
                                               <td></td>
                                           </tr>`;
        $(insertingRow).insertAfter(insertAfterRow);
        addTableDnd();
    }
    //}
    //else {
    //    alert('Type count is required');
    //}
    $('#coverScreen').hide();
}
function loadPropertyStructureTypeDropdownList() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PropertyStructureType]', Condition: 'WHERE IsDeleted = 0' }, callBack: loadPropertyStructureTypeDropdownListCallBack });
}
var loadPropertyStructureTypeDropdownListCallBack = function (responseJSON) {
    propertyStructureTypesArray = responseJSON.resultJSON;
    var alreadySelectedValues = $('#PropertyStructureType').val();
    bindJQueryDropdownList(responseJSON.resultJSON, $('#PropertyStructureType'), 'Select Floor Type', 0);
    if (alreadySelectedValues != '' | alreadySelectedValues != null) {
        $('#PropertyStructureType').val(alreadySelectedValues);
        $('#PropertyStructureType').trigger('change');
    }


}
function loadPropertyStructureTypes(typesJSONArray) {
    //$('#demo_02 tbody').html('');
    var tableRow = '';
    $.each(typesJSONArray, function (rowIndex, rowItem) {
        /*
         <td class="tdTypeID" hidden>`+ rowItem.Value + `</td>
         <td class="tdType">`+ rowItem.Text + `</td>
        */
        var isTypeFound = false;
        $('#demo_02 tr').each(function (rowIndex) {
            if (parseInt(rowItem) == parseInt($(this).find('td.tdTypeID').text())) {
                isTypeFound = true;
                return;
            }

        });
        if (!isTypeFound) {
            /*<button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addTypeRow(this);" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-plus'></i></b></button>
            <button type='button' class='btn bg-danger btn-sm' style="color: white; padding: 0;width: 2.38rem;height: 2.38rem;padding-top: 0.2rem;" onclick="removeTypeRow($(this));">X</button>*/
            tableRow =
                `<tr class='${propertyStructureTypesArray.find(filter => filter.Value == rowItem).Text.replace(/\s/g,'')}'>
                         <td style="padding-top: 0.4rem;
                                    padding-bottom: 0.4rem;
                                    padding-left: 0px;
                                    padding-right: 0px;
                                    width: 20px;
                                    background-image: url('../../../../content/assets/img/drag-green.png'); background-repeat:no-repeat;
                                    background-position:center;"></td>
                                    <td class="select_handle"></td>
                         <td class="tdID select_handle" hidden>`+ 0 + `</td>
                         <td class="tdTypeID select_handle" hidden>`+ rowItem + `</td>
                         <td class="tdType select_handle">`+ propertyStructureTypesArray.find(filter => filter.Value == rowItem).Text + `</td>
                         <td class='parentID select_handle' hidden>`+ 0 + `</td>
                         <td class="tdTypeCount select_handle"></td>
                         <td class="tdTypeCount select_handle"><input type="number" placeholder="Type Count" class="form-control form-control-sm" name="BasementCount" id="BasementCount" min="0" value="`+ 0 + `" /></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>
                         <td>
                            <span class='red-tooltip' data-toggle='tooltip' title='Add sub row'>
                             <button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addTypeRow(this);" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;"><b><i class='icon s7-plus'></i></b></button>
                            </span>
                            <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                                <button type='button' class='btn bg-danger btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="removeTypeRow($(this));"');>
                                    <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                                </button>
                            </span>
                         </td>
                     </tr>`;
            $('#demo_02 tbody').append(tableRow);
            addTableDnd();
        }
    });
}
function getPropertyStructureUnitSegments() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitSegment]', Condition: 'WHERE IsDeleted = 0' }, callBack: getPropertyStructureUnitSegmentsCallBack });
}
var getPropertyStructureUnitSegmentsCallBack = function (responseJSON) {
    unitSegmentArray = responseJSON.resultJSON;
}
function loadUnitSegmentDropdownList(selectedValue) {
    var unitSegment = `<select class="form-control form-control-sm select2" style="padding-top:0px;padding-bottom:0px;">`
    unitSegment += `<option value="">Select Segment</option>`;
    $.each(unitSegmentArray, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.Value) {
            unitSegment += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            unitSegment += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });   
    return unitSegment;
}
function getPropertyStructureUnitType(segmentId, unitTypeTd) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitType]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1 AND UnitSegmentID = ' + segmentId + '' }, callBack: function (responseJSON) {
            propertyStructureUnitTypeArray = responseJSON.resultJSON;
            unitTypeTd.html('<option value="">Select Type</option>');

            $.each(propertyStructureUnitTypeArray, function (index, item) {

                var option = $('<option></option>')
                    .attr('value', item.Value)
                    .text(item.Text);

                // Append the option to the select element
                unitTypeTd.append(option);

            });
        }
    });
}

function loadPropertyStructureUnitTypetDropdownList() {
    var type = `<select class="form-control form-control-sm select2" style="padding-top:0px;padding-bottom:0px;">`
    $.each(propertyStructureUnitTypeArray, function (rowIndex, rowItem) {
        if (rowItem.Value > 0) {
            type += `<option value="` + rowItem.Value + `" selected>` + rowItem.Text + `</option>`;
        }
        else {
            type += `<option value="` + rowItem.Value + `">` + rowItem.Text + `</option>`;
        }

    });
    return type;
}

function removeSubTypeRow(requestedRow) {
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: 'Do you really want to delete this row',
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                requestedRow.closest('tr').remove();
            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
}
function removeTypeRow(requestedRow) {
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: 'By deleting this row will delete its all child as well',
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                $('#coverScreen').show();                
                var insertAfterRow = $(requestedRow).closest('tr');
                var tdTypeID = $(insertAfterRow).find('td.tdTypeID').text();
                $('#demo_02 tr').each(function (rowIndex) {
                    if (parseInt(tdTypeID) == parseInt($(this).find('td.parentID').text())) {
                        $(this).closest('tr').remove();
                    }

                });
                requestedRow.closest('tr').remove();

                //get added types
                var addedArray = $('#PropertyStructureType').val();
                //remove removed type from multiselect as well
                addedArray = $.grep(addedArray, function (value) {
                    return value != tdTypeID;
                });
                //reset tpes multiselect values
                $('#PropertyStructureType').val(addedArray);                
                $('#PropertyStructureType').trigger('change');

            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
    $('#coverScreen').hide();
}
function removeTypeRowChild(requestedRow) {    
    var subTypeName = $(requestedRow).closest('tr').find('td.subTypeName ').text();    
    let subTypeRowClass = $(requestedRow).closest('tr').attr('class'); //--subTypeNameChild.replace('Child', ''); //subTypeNameChild.split(' ')[0];       
    subTypeRowClass = subTypeRowClass.split(' ')[0];
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `By deleting ${subTypeName}, will delete its all child as well`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                
                $('#coverScreen').show();                
                var insertAfterRow = $(requestedRow).closest('tr');
                
                var parentID = $(insertAfterRow).find('td.parentID ').text();
                
                $('#demo_02 tr').each(function (rowIndex) {                                        
                    if ($(this).hasClass(subTypeRowClass + 'Child')) {
                        $(this).closest('tr').remove();
                    }

                });                
                requestedRow.closest('tr').remove();


                subTypeRowClass = subTypeRowClass.replace('Child', '').replace(/[0-9]/g, '');
                let typeCount = parseInt($('#demo_02 tr.' + subTypeRowClass + ' td.tdTypeCount').find('input').val());
                $('#demo_02 tr.' + subTypeRowClass + ' td.tdTypeCount').find('input').val((typeCount - 1));
                $('#coverScreen').hide();               
            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
    
}
function getAddedPropertyStructure() {

    var propertyStructureJSONArray = [];
    $('#demo_02 tr').each(function (rowIndex) {
        if (rowIndex > 0) {
            var propertyStructureJSONObject = {};
            //if ($(this).find('td.tdType').text() == '') {
            //    propertyStructureJSONObject['SubTypeName'] = $(this).find('td.subTypeName').text();
            //}
            //else {
            propertyStructureJSONObject['ID'] = parseInt($(this).find('td.tdID').text());
            propertyStructureJSONObject['TypeID'] = parseInt($(this).find('td.tdTypeID').text());
            propertyStructureJSONObject['TypeName'] = $(this).find('td.tdType').text();
            propertyStructureJSONObject['Code'] = $(this).find('td.tdCode').find('input').val();
            propertyStructureJSONObject['TypeCount'] = parseInt($(this).find('td.tdTypeCount').find('input').val());
            propertyStructureJSONObject['ParentID'] = parseInt($(this).find('td.parentID').text());
            propertyStructureJSONObject['SubTypeName'] = $(this).find('td.subTypeName').text();
            propertyStructureJSONObject['SubTypeChildName'] = $(this).find('td.subTypeChildName').text();
            propertyStructureJSONObject['UnitSegmentID'] = $(this).find('td.tdUnitSegment').find('select').val() == undefined ? null : parseInt($(this).find('td.tdUnitSegment').find('select').val());
            propertyStructureJSONObject['UnitSegmentName'] = $(this).find('td.tdUnitSegment').find('select').val() == undefined ? '' : $(this).find('td.tdUnitSegment').find('select option:selected').text();
            propertyStructureJSONObject['UnitTypeID'] = $(this).find('td.tdUnitType').find('select').val() == undefined ? null : parseInt($(this).find('td.tdUnitType').find('select').val());
            propertyStructureJSONObject['UnitTypeName'] = $(this).find('td.tdUnitType').find('select').val() == undefined ? '' : $(this).find('td.tdUnitType').find('select option:selected').text();
            propertyStructureJSONObject['UnitTypeCount'] = $(this).find('td.tdUnitTypeCount').find('input').val() == undefined ? 0 : parseInt($(this).find('td.tdUnitTypeCount').find('input').val());

            propertyStructureJSONObject['ParkingFKey'] = $(this).find('td.tdParkingFKey').text();

            propertyStructureJSONObject['RowNumber'] = rowIndex;
            //}
            propertyStructureJSONArray.push(propertyStructureJSONObject);
        }
    });
    return propertyStructureJSONArray;
}
