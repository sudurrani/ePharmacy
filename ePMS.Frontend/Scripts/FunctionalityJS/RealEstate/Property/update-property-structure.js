var propertyStructureTypesArray = [];
var unitSegmentArray = [];
var propertyStructureUnitTypeArray = [];
var addedPropertyStructureTypeArray = [];
var allUnitTypesArray = [];

$(function () {
    //loadPropertyStructureTypeDropdownList();
    //getPropertyStructureUnitSegments();
    //getAllPropertyUnitTypes();


    //getPropertyStructureUnitType();    
    $('#btnAddPropertyStructureType').click(function () {
        var selectectedFloorType = $('#PropertyStructureType').val();
        if (selectectedFloorType == '') {
            infoToastr("First select one or more Floor Type(s)", 'info');
        }
        else {
            loadPropertyStructureTypes($('#PropertyStructureType').val());
        }
    });
    $('#demo_02').on('click', 'tr', function (event) {
        var typeID = parseInt($(this).find('td.tdTypeID').text())
        var parentID = parseInt($(this).find('td.parentID').text())

        $('#demo_02 tr').each(function (rowIndex) {
            if (parseInt(typeID) == parseInt($(this).find('td.parentID').text()) && parentID == 0) {
                //$(this).addClass('selected');
            }

        });
    });
    $('body').on('change', 'td.tdUnitSegment select', function () {
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
var getPropertyStructureByPropertyIDCallBack = function (responseJSON) {
    $('#demo_02 tbody').html('');
    var tableRow = '';

    /*
    <button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addTypeRow(this);" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-plus'></i></b></button>
                             <button type='button' class='btn bg-danger btn-sm' style="color: white; padding: 0;width: 2.38rem;height: 2.38rem;padding-top: 0.2rem;" onclick="removeTypeRow($(this));">X</button>
    */
    let propertyStructureArray = responseJSON.resultJSON.PropertyStructures;
    parkingNumbersArray = responseJSON.resultJSON.ParkingNumbers;
    let _parkingArray = [];
    $.each(propertyStructureArray, function (rowIndex, rowItem) {
        debugger;
        let parkingParkingFKeyVal = getYYYYMMDDHHMMSSMS();// new Date().getYYYYMMDDHHMMSSMS();
        //| Set FKey in parking numbers

        let parkingArray = parkingNumbersArray.filter(row => row.PropertyStructureID == rowItem.ID);
        parkingArray.forEach(function (parkingNumber) {
            if (parkingNumber.PropertyStructureID === rowItem.ID) {
                parkingNumber.ParkingFKey = parkingParkingFKeyVal;
            }
        });
        if (parkingArray) {
            _parkingArray = [..._parkingArray, ...parkingArray]
        }
        if (rowItem.ParentID == 0) {
            tableRow =
                `<tr class='${rowItem.TypeName.replace(/\s/g, '')}'>
                        <td hidden></td>
                         <td class="select_handle" hidden></td>
                         <td class="tdID select_handle" hidden>`+ rowItem.ID + `</td>
                         <td class="tdTypeID select_handle" hidden>`+ rowItem.TypeID + `</td>
                         <td class="tdType select_handle">`+ rowItem.TypeName + `</td>
                         <td class="tdCode select_handle"></td>
                         <td class="tdParkingFKey" hidden>`+ parkingParkingFKeyVal + `</td>
                         <td class='parentID select_handle' hidden>`+ rowItem.ParentID + `</td>
                         <td class="tdTypeCount select_handle"><div class="selector" style="margin-top:0px !important;"><input type="number" placeholder="Type Count" class="js-states form-control selector_2 bha-input w-100 mt-0" name="BasementCount" id="BasementCount" min="0" value="`+ rowItem.TypeCount + `" /></div></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>                         
                         <td class="tdAction">
                            <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addTypeRow(this)"></i>
                            <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTypeRow(this)"></i>
                         </td>                         
                     </tr>`;
            /* COMMENTED BELOW AFTER NEW DESIGN
            <span class='red-tooltip' data-toggle='tooltip' title='Add sub row'>
                    <button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addTypeRow(this);" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;"><b><i class='icon s7-plus'></i></b></button>
                   </span>
                   <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                       <button type='button' class='btn bg-danger btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="removeTypeRow($(this));"');>
                           <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                       </button>
                   </span>
            */
        }
        else if (rowItem.ParentID > 0) {
            var subTypeSubTypeChild = '', subTypeAddRemoveButton = '', subTypeSubTypeChildRowClass = '';
            if (rowItem.SubTypeChildName == '' && rowItem.SubTypeName != '') {
                subTypeSubTypeChildRowClass = rowItem.SubTypeName;
                subTypeSubTypeChild = ` <td class="subTypeName select_handle">` + rowItem.SubTypeName + `</td>`;
                subTypeAddRemoveButton = `<i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addSubTypeRow(this)"></i>`

                /*
                 `
                    <span class='red-tooltip' data-toggle='tooltip' title='Add sub row'>
                             <button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addSubTypeRow(this);" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;"><b><i class='icon s7-plus'></i></b></button>
                            </span>
                   `
                   */
                if (rowItem.UnitSegmentName == 'Parking') {
                    subTypeAddRemoveButton += `<span class='span-btnAdParkingNumbers'><i class="bi bi-p-circle fs-6 text-primary me-2" style="cursor:pointer;" onclick="addParkingName(this)"></i></span>`;
                    /*`
                    <span class='red-tooltip span-btnAdParkingNumbers' data-toggle='tooltip' title='Add parking name(s)'>
                                    <button type='button' class='btn bg-info btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="addParkingName(this);">
                                    <i class='fa fa-parking' style='padding:0;color:#fff;'></i>
                                    </button>
                                    </span>
                                    `
                                    */
                }
                else {
                    subTypeAddRemoveButton += `<span class='span-btnAdParkingNumbers' style='display:none;'><i class="bi bi-p-circle fs-6 text-primary me-2" style="cursor:pointer;" onclick="addParkingName(this)"></i></span>`;
                    /*`
                    <span class='red-tooltip span-btnAdParkingNumbers' data-toggle='tooltip' title='Add parking name(s)' style='display:none;'>
                                    <button type='button' class='btn bg-info btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="addParkingName(this);">
                                    <i class='fa fa-parking' style='padding:0;color:#fff;'></i>
                                    </button>
                                    </span>
                                    `
                                    */
                }
                //Add remove button at the end
                subTypeAddRemoveButton += `<i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTypeRowChild($(this))"></i>`;
                /*`
                <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                                        <button type='button' class='btn bg-danger btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="removeTypeRowChild($(this));"');>
                                            <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                                        </button>
                                    </span>
                `;*/

            }
            else {
                subTypeSubTypeChild = ` <td style="" class="subTypeChildName select_handle">` + rowItem.SubTypeChildName + `</td>`;
                subTypeSubTypeChildRowClass = rowItem.SubTypeChildName;
                subTypeSubTypeChildRowClass = rowItem.SubTypeChildName + 'Child';


                subTypeAddRemoveButton = `<i class="bi bi-x-circle fs-6 text-danger me-2" style="cursor:pointer;" onclick="removeSubTypeRow($(this))"></i>`;
                /*`
                <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                            <button type='button' class='btn bg-danger btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="removeSubTypeRow($(this));"');>
                                <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                            </button>
                        </span>
            `*/
                if (rowItem.UnitSegmentName == 'Parking') {
                    subTypeAddRemoveButton += `<span class='span-btnAdParkingNumbers'><i class="bi bi-p-circle fs-6 text-primary me-2" style="cursor:pointer;" onclick="addParkingName(this)"></i></span>`;
                    /*`
                    <span class='red-tooltip span-btnAdParkingNumbers' data-toggle='tooltip' title='Add parking name(s)'>
                                    <button type='button' class='btn bg-info btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="addParkingName(this);">
                                    <i class='fa fa-parking' style='padding:0;color:#fff;'></i>
                                    </button>
                                    </span>
                                    `
                                    */
                }
                else {
                    subTypeAddRemoveButton += `<span class='span-btnAdParkingNumbers' style='display:none;'><i class="bi bi-p-circle fs-6 text-primary me-2" style="cursor:pointer;" onclick="addParkingName(this)"></i></span>`;
                    /*`
                    <span class='red-tooltip span-btnAdParkingNumbers' data-toggle='tooltip' title='Add parking name(s)' style='display:none;'>
                                    <button type='button' class='btn bg-info btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="addParkingName(this);">
                                    <i class='fa fa-parking' style='padding:0;color:#fff;'></i>
                                    </button>
                                    </span>
                                    `
                                    */
                }

                //`<button type='button' class='btn bg-danger btn-sm' style="color: white; padding: 0;width: 2.38rem;height: 2.38rem;padding-top: 0.2rem;" onclick="removeSubTypeRow($(this));">X</button>`;
            }
            var propertyStructureUnitSegmentDDL = loadUnitSegmentDropdownList(rowItem.UnitSegmentID);
            var propertyStructureUnitTypeDDL = loadPropertyStructureUnitTypetDropdownList(rowItem.UnitSegmentID, rowItem.UnitTypeID);
            tableRow =
                `<tr class="${subTypeSubTypeChildRowClass.replace(/\s/g, '')}">
                         <td hidden></td>
                         <td class="select_handle" hidden></td>
                         <td class="tdID select_handle" hidden>`+ rowItem.ID + `</td>
                         <td class="tdParkingFKey" hidden>`+ parkingParkingFKeyVal + `</td>
                         <td class="tdTypeID select_handle" hidden>`+ rowItem.TypeID + `</td>
                         <td class="select_handle"></td>
                         <td class="tdCode select_handle"><div class="selector" style="margin-top:0px !important;"><input type="text" placeholder="Code" class="js-states form-control selector_2 bha-input w-100 mt-0" name="Code" id="Code" min="1" maxlength="3" value="`+ rowItem.Code + `"/></div></td>
                        `+ subTypeSubTypeChild + `
                         <td class='parentID select_handle' hidden>`+ rowItem.ParentID + `</td>

                         <td class='tdUnitSegment select_handle'>`+ propertyStructureUnitSegmentDDL + `</td>
                         <td class='tdUnitType select_handle'>`+ propertyStructureUnitTypeDDL + `</td>
                         <td class='tdUnitTypeCount select_handle'><div class="selector" style="margin-top:0px !important;"><input type="number" placeholder="Unit Type Count" class="js-states form-control selector_2 bha-input w-100 mt-0" value="`+ rowItem.UnitTypeCount + `" /></div></td>
                          <td class="tdAction">
                              `+ subTypeAddRemoveButton + `
                          </td>
                          <td></td>
                     </tr>`;
        }
        //$(tableRow).find('td.tdUnitSegment').find('select option:selected').val(2);
        $('#demo_02 tbody').append(tableRow);
        $('select.selector_2').not('.select2-hidden-accessible').select2({
            width: "100%",
            placeholder: "Select an option",
            minimumResultsForSearch: 0,
        });
        // addTableDnd(); COMMENTED AFTER NEW DESIGN
        if (addedPropertyStructureTypeArray.indexOf(rowItem.TypeID) === -1) {
            addedPropertyStructureTypeArray.push(rowItem.TypeID);
        }

    });

    parkingNumbersArray = _parkingArray;
    addedPropertyStructureTypeArray = $.grep(addedPropertyStructureTypeArray, function (value) {
        return value != 0;
    });
    $('#PropertyStructureType').val(addedPropertyStructureTypeArray);//.change();
    $('#PropertyStructureType').trigger('change');
}

addTypeRow = function (requestedRow) {
    var propertyStructureUnitSegmentDDL = loadUnitSegmentDropdownList(0);
    //var propertyStructureUnitTypeDDL = loadPropertyStructureUnitTypetDropdownList(0);

    var insertAfterRow = $(requestedRow).closest('tr');
    var nextRowAfterCurrent = $(requestedRow).closest('tr').next('tr');
    var inputValue = $(insertAfterRow).find('input').val();
    var typeID = $(insertAfterRow).find('td.tdTypeID').text();
    var typeName = $(insertAfterRow).find('td.tdType').text();
    if (inputValue != null && inputValue != undefined && inputValue != '' && parseInt(inputValue) > 0) {
        for (var rowIndex = 1; rowIndex <= inputValue; rowIndex++) {
            let parkingParkingFKeyVal = getYYYYMMDDHHMMSSMS(); //new Date().getYYYYMMDDHHMMSSMS();
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
                                    background-image: url('../../../../content/assets/img/drag-greenX.png'); background-repeat:no-repeat;
                                    background-position:center;" hidden></td>
                                    <td class="select_handle" hidden></td>
                             <td class="tdID select_handle" hidden>`+ 0 + `</td>
                             <td></td>
                             <td class="tdParkingFKey" hidden>`+ parkingParkingFKeyVal + `</td>
                             <td class="tdTypeID select_handle" hidden>`+ typeID + `</td>
                             <td class="tdCode select_handle"><div class="selector" style="margin-top:0px !important;"><input type="text" placeholder="Code" class="js-states form-control selector_2 bha-input w-100 mt-0" name="Code" id="Code" min="1" maxlength="3" /></div></td>
                               <td class='subTypeName select_handle'>`+ typeName + ` ` + parseInt(rowIndex) + `</td>
                             <td class='parentID select_handle' hidden>`+ typeID + `</td>
                             <td class='tdUnitSegment select_handle'>`+ propertyStructureUnitSegmentDDL + `</td>
                             <td class='tdUnitType select_handle'><div class="selector" style="margin-top:0px !important;"><select class="js-states form-control selector_2 w-100"></select></div></td>
                             <td class='tdUnitTypeCount select_handle'><div class="selector" style="margin-top:0px !important;"><input type="number" placeholder="Unit Type Count" class="js-states form-control selector_2 bha-input w-100 mt-0" value="`+ 0 + `" /></div></td>
                            <td class="tdAction">                                
                                <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addSubTypeRow(this)"></i>
                                <span class='span-btnAdParkingNumbers' style='display:none;'><i class="bi bi-p-circle fs-6 text-primary me-2" style="cursor:pointer;" onclick="addParkingName(this)"></i></span>
                                <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTypeRowChild(this)"></i>
                            </td>
                            <td></td>
                            </tr>`;
                $(insertingRow).insertAfter(insertAfterRow);
                //addTableDnd();
                $('select.selector_2').not('.select2-hidden-accessible').select2({
                    width: "100%",
                    placeholder: "Select an option",
                    minimumResultsForSearch: 0,
                });

            }
            /* COMMENTED BELOW AFTER NEW DESIGN
            <span class='red-tooltip span-btnAddSubTypeRow' data-toggle='tooltip' title='Add sub row'>
                             <button type="button" class="btn  btn-sm btn-primary btnAddType" onclick="addSubTypeRow(this);" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;"><b><i class="icon s7-plus"></i></b></button>
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
            */
            insertAfterRow = $(insertAfterRow).closest('tr').next('tr');
            nextRowAfterCurrent = $(nextRowAfterCurrent).closest('tr').next('tr');


        }
    }
    else {
        infoToastr('Type count is required', 'info')
    }
}
function addSubTypeRow(requestedRow) {
    var propertyStructureUnitSegmentDDL = loadUnitSegmentDropdownList(0);
    //var propertyStructureUnitTypeDDL = loadPropertyStructureUnitTypetDropdownList(0);

    var insertAfterRow = $(requestedRow).closest('tr');
    var inputValue = $(insertAfterRow).find('input').val();
    var typeName = $(insertAfterRow).find('td.tdType').text();
    var subTypeName = $(insertAfterRow).find('td.subTypeName').text();
    //if (inputValue != null && inputValue != undefined && inputValue != '' && parseInt(inputValue) > 0) {
    //$('.' + typeName + 'Child').remove();

    //<button type='button' class='btn bg-danger btn-sm' style="color: white; padding: 0;width: 2.38rem;height: 2.38rem;padding-top: 0.2rem;" onclick="removeSubTypeRow($(this));">X</button>
    for (var rowIndex = 1; rowIndex > 0; rowIndex--) {
        let parkingParkingFKeyVal = getYYYYMMDDHHMMSSMS(); // new Date().getYYYYMMDDHHMMSSMS();
        var insertingRow = `<tr class="` + subTypeName + `Child">
            <td style="padding-top: 0.4rem;
                                    padding-bottom: 0.4rem;
                                    padding-left: 0px;
                                    padding-right: 0px;
                                    width: 20px;
                                    background-image: url('../../../../content/assets/img/drag-greenX.png'); background-repeat:no-repeat;
                                    background-position:center;" hidden></td>
                                    <td class="select_handle" hidden></td>
                                               <td class='tdID select_handle' hidden>0</td>
                                               <td></td>
                                               <td class="tdParkingFKey" hidden>`+ parkingParkingFKeyVal + `</td>
                                               <td class='parentID select_handle' hidden>`+ $(insertAfterRow).find('td.parentID').text() + `</td>
                                               <td class="tdCode select_handle"><div class="selector" style="margin-top:0px !important;"><input type="text" placeholder="Code" class="js-states form-control selector_2 bha-input w-100 mt-0" name="Code" id="Code" min="1" maxlength="3" /></div></td>
                                               <td style='' class='subTypeChildName select_handle'>`+ subTypeName + `</td>
                                               <td class='tdUnitSegment select_handle'>`+ propertyStructureUnitSegmentDDL + `</td>

                                               <td class='tdUnitType select_handle'><div class="selector" style="margin-top:0px !important;"><select class="js-states form-control selector_2 w-100"></select></div></td>
                                               <td class='tdUnitTypeCount select_handle'><div class="selector" style="margin-top:0px !important;"><input type="number" placeholder="Unit Type Count" class="js-states form-control selector_2 bha-input w-100 mt-0" value="0" /></div></td>
                                               <td class="tdAction">
                                               <i class="bi bi-x-circle fs-6 text-danger me-2" style="cursor:pointer;" onclick="removeSubTypeRow($(this))"></i>
                                               <span class='span-btnAdParkingNumbers' style='display:none;'><i class="bi bi-p-circle fs-6 text-primary me-2" style="cursor:pointer;" onclick="addParkingName(this)"></i></span>
                                               </td>
                                               <td></td>
                                           </tr>`;
        $(insertingRow).insertAfter(insertAfterRow);
        //addTableDnd();
        $('select.selector_2').not('.select2-hidden-accessible').select2({
            width: "100%",
            placeholder: "Select an option",
            minimumResultsForSearch: 0,
        });
        /*
        COMMENTED AFTER NEW DESIGN
        <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                                                    <button type='button' class='btn bg-danger btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="removeSubTypeRow($(this));"');>
                                                        <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                                                    </button>
                                                </span>
                                                <span class='red-tooltip span-btnAdParkingNumbers' data-toggle='tooltip' title='Add parking name(s)' style='display:none;'>
                                    <button type='button' class='btn bg-info btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="addParkingName(this);">
                                    <i class='fa fa-parking' style='padding:0;color:#fff;'></i>
                                    </button>
                                 </span>
        */
    }
}

function loadPropertyStructureTypeDropdownList() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.PropertyStructureType]', Condition: 'WHERE IsDeleted = 0' }, callBack: loadPropertyStructureTypeDropdownListCallBack });
}
var loadPropertyStructureTypeDropdownListCallBack = function (responseJSON) {
    //$('#demo_02 tbody').html('');
    //var tableRow = '';
    //$.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
    //    tableRow =
    //        `<tr>
    //                 <td class="tdID" hidden>`+ 0 + `</td>
    //                 <td class="tdTypeID" hidden>`+ rowItem.Value + `</td>
    //                 <td class="tdType">`+ rowItem.Text + `</td>
    //                 <td class='parentID' hidden>`+ 0 + `</td>
    //                 <td class="tdTypeCount"><input type="number" placeholder="Type Count" class="form-control form-control-sm" name="BasementCount" id="BasementCount" min="0" value="`+ 0 + `" /></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>
    //                     <button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addTypeRow(this);" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-plus'></i></b></button>
    //                     <button type='button' class='btn bg-danger btn-sm' style="color: white; padding: 0;width: 2.38rem;height: 2.38rem;padding-top: 0.2rem;" onclick="removeTypeRow($(this));">X</button>
    //                 </td>
    //             </tr>`;
    //    $('#demo_02 tbody').append(tableRow);
    //});
    var alreadySelectedValues = $('#PropertyStructureType').val();
    propertyStructureTypesArray = responseJSON.resultJSON;
    bindJQueryDropdownList(responseJSON.resultJSON, $('#PropertyStructureType'), 'Select Floor Type', 0, { text: 'Add New Profession', function: 'newLandlordProfession' });
    //if (alreadySelectedValues != '' | alreadySelectedValues != null) {
    
    if (alreadySelectedValues.length > 0) {           
        $('#PropertyStructureType').val(alreadySelectedValues);
        $('#PropertyStructureType').trigger('change');
    }
    //Get Unit Segments
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitSegment]', Condition: 'WHERE IsDeleted = 0' }, callBack:
            function (responseJSON) {
                unitSegmentArray = responseJSON.resultJSON;
                //Get Unit Types
                ajaxRequest({
                    url: '/RealEstate/Unit/GetAllUnitType', type: 'GET', data: {}, callBack: function (responseJSON) {
                        allUnitTypesArray = responseJSON.resultJSON;
                        ajaxRequest({ url: '/RealEstate/PropertyStructure/GetByPropertyID', type: 'POST', data: { propertyID: $('#ID').val() }, callBack: getPropertyStructureByPropertyIDCallBack });
                    }
                });
            }
        });

}
function getPropertyStructureUnitSegmentsX() {
    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitSegment]', Condition: 'WHERE IsDeleted = 0' }, callBack: getPropertyStructureUnitSegmentsCallBack });
}
var getPropertyStructureUnitSegmentsCallBack = function (responseJSON) {
    unitSegmentArray = responseJSON.resultJSON;

    
}
function loadUnitSegmentDropdownList(selectedValue) {
    var unitSegment = `<div class="selector" style="margin-top:0px !important;"><select class="js-states form-control selector_2 w-100">`
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
    /*
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitType]', Columns: 'ID Value, Description Text', Condition: 'WHERE IsActive = 1 AND UnitSegmentID = ' + segmentId + '' }, callBack: function (responseJSON) {
            propertyStructureUnitTypeArray = responseJSON.resultJSON;
            unitTypeTd.html('');

            $.each(propertyStructureUnitTypeArray, function (index, item) {

                var option = $('<option></option>')
                    .attr('value', item.Value)
                    .text(item.Text);

                // Append the option to the select element
                unitTypeTd.append(option);

            });
        }
    });
    */
    unitTypeTd.html('<option value="">Select Type</option>');
    var unitTypeBySegmentID = allUnitTypesArray.filter(row => row.UnitSegmentID == segmentId);
    $.each(unitTypeBySegmentID, function (index, item) {

        var option = $('<option></option>')
            .attr('value', item.ID)
            .text(item.Description);

        // Append the option to the select element
        unitTypeTd.append(option);

    });
}

//function getPropertyStructureUnitType() {
//    ajaxRequest({ url: '/RealEstate/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.UnitType]' }, callBack: getPropertyStructureUnitTypeCallBack });
//}
//var getPropertyStructureUnitTypeCallBack = function (responseJSON) {
//    propertyStructureUnitTypeArray = responseJSON.resultJSON;
//    console.log(responseJSON.resultJSON);
//}
function loadPropertyStructureTypes(typesJSONArray) {

    /*
    <button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addTypeRow(this);" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-plus'></i></b></button>
                             <button type='button' class='btn bg-danger btn-sm' style="color: white; padding: 0;width: 2.38rem;height: 2.38rem;padding-top: 0.2rem;" onclick="removeTypeRow($(this));">X</button>
    */
    //$('#demo_02 tbody').html('');
    var tableRow = '';
    $.each(typesJSONArray, function (rowIndex, rowItem) {
        let parkingParkingFKeyVal = getYYYYMMDDHHMMSSMS(); // new Date().getYYYYMMDDHHMMSSMS();
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
            tableRow =
                `<tr class="${propertyStructureTypesArray.find(filter => filter.Value == rowItem).Text.replace(/\s/g, '')}">
                         <td style="padding-top: 0.4rem;
                                    padding-bottom: 0.4rem;
                                    padding-left: 0px;
                                    padding-right: 0px;
                                    width: 20px;
                                    background-image: url('../../../../content/assets/img/drag-greenX.png'); background-repeat:no-repeat;
                                    background-position:center;" hidden></td>
                                    <td class="select_handle" hidden></td>
                         <td class="tdID select_handle" hidden>`+ 0 + `</td>
                         <td class="tdTypeID select_handle" hidden>`+ rowItem + `</td>
                         <td class="tdType select_handle">`+ propertyStructureTypesArray.find(filter => filter.Value == rowItem).Text + `</td>                         

                         <td class="tdParkingFKey" hidden>`+ parkingParkingFKeyVal + `</td>
                         <td class='parentID select_handle' hidden>`+ 0 + `</td>
                         <td class="tdTypeCount select_handle"><div class="selector" style="margin-top:0px !important;"><input type="number" placeholder="Type Count" class="js-states form-control selector_2 bha-input w-100 mt-0" name="BasementCount" id="BasementCount" min="0" value="`+ 0 + `" /></div></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>
                         <td class="select_handle"></td>                         
                         <td class="select_handle"></td>                         
                         <td>                             
                            <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addTypeRow(this)"></i>
                            <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeTypeRow(this)"></i>
                            
                         </td>
                     </tr>`;
            $('#demo_02 tbody').append(tableRow);
            //addTableDnd();
            /* COMMENTED BELOW ACTION AFTER NEW DESIGN
            <span class='red-tooltip' data-toggle='tooltip' title='Add sub row'>
                             <button type='button' class='btn  btn-sm btn-primary btnAddType' onclick="addTypeRow(this);" style="padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;"><b><i class='icon s7-plus'></i></b></button>
                            </span>
                            <span class='red-tooltip' data-toggle='tooltip' title='Remove this row'>
                                <button type='button' class='btn bg-danger btn-sm' style='padding: 0;width:2.1rem;height: 2rem;;font-size: 1.4rem; padding-top: 3px; margin-top: 0px;' onclick="removeTypeRow($(this));"');>
                                    <i class='fa fa-times' style='padding:0;color:#fff;'></i>
                                </button>
                            </span>
            */

        }
    });
}
function loadPropertyStructureUnitTypetDropdownList(segmentId, selectedValue) {

    var type = `<div class="selector" style="margin-top:0px !important;">
                    <select class="js-states form-control selector_2 w-100">`
    var unitTypeBySegmentID = allUnitTypesArray.filter(row => row.UnitSegmentID == segmentId);
    $.each(unitTypeBySegmentID, function (rowIndex, rowItem) {
        if (selectedValue == rowItem.ID) {
            type += `<option value="` + rowItem.ID + `" selected>` + rowItem.Description + `</option>`;
        }
        else {
            type += `<option value="` + rowItem.ID + `">` + rowItem.Description + `</option>`;
        }

    });
    return type;



}

function removeTypeRow(requestedRow) {
    var tdTypeName = $(requestedRow).closest('tr').find('td.tdType').text();
    let subTypeRowClass = $(requestedRow).closest('tr').attr('class'); //--subTypeNameChild.replace('Child', ''); //subTypeNameChild.split(' ')[0];       
    subTypeRowClass = subTypeRowClass.split(' ')[0];
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `By deleting ${tdTypeName}, will delete its all child as well`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                var idsArray = [];
                var insertAfterRow = $(requestedRow).closest('tr');
                var tdTypeID = $(insertAfterRow).find('td.tdTypeID').text();
                let id = $(requestedRow).closest('tr').find('td.tdID').text();
                if (id > 0) {
                    idsArray.push({ ID: id });
                }
                for (var i = 0; i < $('#demo_02 tr').length; i++) {
                    var subTypeRowSubTypeClass = subTypeRowClass + i;
                    $('#demo_02 tr').each(function (rowIndex) {
                        if ($(this).hasClass(subTypeRowSubTypeClass + 'Child') || $(this).hasClass(subTypeRowSubTypeClass)) {
                            var id = $(this).find('td.tdID').text();
                            if (id > 0) {
                                idsArray.push({ ID: id });
                            }
                        }

                    });
                }
                if (idsArray.length > 0) {
                    ajaxRequest({
                        url: '/RealEstate/PropertyStructure/GetByIDs', type: 'POST', data: idsArray, callBack: function (responseJSON) {
                            if (responseJSON.IsSuccess) {
                                if (responseJSON.resultJSON.length > 0) {
                                    var message = 'Unit exist with ';
                                    $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
                                        message += rowIndex == 0 ? `Code (${rowItem.Code}), Type (${rowItem.SubTypeChildName}) ` : `& Code (${rowItem.Code}), Type (${rowItem.SubTypeChildName}) `;
                                    });
                                    swal.fire(`Can't delete`, message, 'warning');
                                }
                                else {
                                    ajaxRequest({
                                        url: '/RealEstate/PropertyStructure/BulkDelete', type: 'POST', data: idsArray, callBack: function (responseJSON) {
                                            if (responseJSON.IsSuccess) {
                                                $('#demo_02 tr').each(function (rowIndex) {
                                                    if ($(this).hasClass(subTypeRowClass + 'Child')) {
                                                        $(this).closest('tr').remove();
                                                    }

                                                });

                                                // REMOVE CHILD ROWs
                                                $('#demo_02 tr').each(function (rowIndex) {
                                                    if (parseInt(tdTypeID) == parseInt($(this).find('td.parentID').text())) {
                                                        $(this).closest('tr').remove();
                                                    }
                                                });
                                                // REMOVE CURRENT ROW 
                                                $(requestedRow).closest('tr').remove();

                                                //get added types
                                                var addedArray = $('#PropertyStructureType').val();
                                                //remove removed type from multiselect as well
                                                addedArray = $.grep(addedArray, function (value) {
                                                    return value != tdTypeID;
                                                });
                                                //reset tpes multiselect values
                                                $('#PropertyStructureType').val(addedArray);
                                                $('#PropertyStructureType').trigger('change');
                                                successToastr('Deleted successfully');
                                            }
                                            else {
                                                errorToastr('An error occured, while deleting please try later');
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    });
                }
                else {
                    $('#demo_02 tr').each(function (rowIndex) {
                        if ($(this).hasClass(subTypeRowClass + 'Child')) {
                            $(this).closest('tr').remove();
                        }

                    });

                    // REMOVE CHILD ROWs
                    $('#demo_02 tr').each(function (rowIndex) {
                        if (parseInt(tdTypeID) == parseInt($(this).find('td.parentID').text())) {
                            $(this).closest('tr').remove();
                        }
                    });
                    // REMOVE CURRENT ROW 
                    $(requestedRow).closest('tr').remove();

                    //get added types
                    var addedArray = $('#PropertyStructureType').val();
                    //remove removed type from multiselect as well
                    addedArray = $.grep(addedArray, function (value) {
                        return value != tdTypeID;
                    });
                    //reset tpes multiselect values
                    $('#PropertyStructureType').val(addedArray);
                    $('#PropertyStructureType').trigger('change');

                    //REMOVE FROM DB                
                    //if (id > 0) {
                    //    ajaxRequest({
                    //        url: '/RealEstate/PropertyStructure/Delete', type: 'POST', data: { ID: id }, callBack: function (responseJSON) {
                    //            if (responseJSON.IsSuccess) {

                    //            }
                    //        }
                    //    });
                    //}
                    successToastr('Record deleted successfully', 'success');

                }
            }
            else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
}
function removeSubTypeRow(requestedRow) {
    var subTypeChildName = $(requestedRow).closest('tr').find('td.subTypeChildName').text();
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `Do you really want to delete ${subTypeChildName}`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                var idsArray = [];
                let id = $(requestedRow).closest('tr').find('td.tdID').text();

                if (id > 0) {
                    idsArray.push({ ID: id });
                    ajaxRequest({
                        url: '/RealEstate/PropertyStructure/GetByIDs', type: 'POST', data: idsArray, callBack: function (responseJSON) {
                            if (responseJSON.IsSuccess) {
                                if (responseJSON.resultJSON.length > 0) {
                                    var message = 'Unit exist with ';
                                    $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
                                        message += rowIndex == 0 ? `Code (${rowItem.Code}), Type (${rowItem.SubTypeChildName}) ` : `& Code (${rowItem.Code}), Type (${rowItem.SubTypeChildName}) `;
                                    });
                                    swal.fire(`Can't delete`, message, 'warning');
                                }
                                else {
                                    ajaxRequest({
                                        url: '/RealEstate/PropertyStructure/Delete', type: 'POST', data: { ID: id }, callBack: function (responseJSON) {
                                            if (responseJSON.IsSuccess) {
                                                $(requestedRow).closest('tr').remove();
                                                successToastr('Record deleted successfully', 'success');
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                else {
                    $(requestedRow).closest('tr').remove();
                    successToastr('Record deleted successfully', 'success');
                }

            } else {
                swal.fire("Cancelled", "Your operation Canceled :)", "error");
            }
        });
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
                var idsArray = [];
                $('#coverScreen').show();
                // Check if Feature against Unit exist                
                var insertAfterRow = $(requestedRow).closest('tr');
                var id = $(insertAfterRow).find('td.tdID').text();
                if (id > 0) {
                    idsArray.push({ ID: id });
                }
                var parentID = $(insertAfterRow).find('td.parentID ').text();

                $('#demo_02 tr').each(function (rowIndex) {
                    if ($(this).hasClass(subTypeRowClass + 'Child')) {
                        var id = $(this).find('td.tdID').text();
                        if (id > 0) {
                            idsArray.push({ ID: id });
                        }

                        //$(this).closest('tr').remove();
                    }

                });
                if (idsArray.length > 0) {
                    ajaxRequest({
                        url: '/RealEstate/PropertyStructure/GetByIDs', type: 'POST', data: idsArray, callBack: function (responseJSON) {
                            if (responseJSON.IsSuccess) {
                                if (responseJSON.resultJSON.length > 0) {
                                    var message = 'Unit exist with ';
                                    $.each(responseJSON.resultJSON, function (rowIndex, rowItem) {
                                        message += rowIndex == 0 ? `Code (${rowItem.Code}), Type (${rowItem.SubTypeChildName}) ` : `& Code (${rowItem.Code}), Type (${rowItem.SubTypeChildName}) `;
                                    });
                                    swal.fire(`Can't delete`, message, 'warning');
                                }
                                else {
                                    ajaxRequest({
                                        url: '/RealEstate/PropertyStructure/BulkDelete', type: 'POST', data: idsArray, callBack: function (responseJSON) {
                                            if (responseJSON.IsSuccess) {
                                                $('#demo_02 tr').each(function (rowIndex) {
                                                    if ($(this).hasClass(subTypeRowClass + 'Child')) {
                                                        $(this).closest('tr').remove();
                                                    }

                                                });

                                                requestedRow.closest('tr').remove();

                                                subTypeRowClass = subTypeRowClass.replace('Child', '').replace(/[0-9]/g, '');
                                                let typeCount = parseInt($('#demo_02 tr.' + subTypeRowClass + ' td.tdTypeCount').find('input').val());
                                                $('#demo_02 tr.' + subTypeRowClass + ' td.tdTypeCount').find('input').val((typeCount - 1));
                                                successToastr('Deleted successfully');
                                            }
                                            else {
                                                errorToastr('An error occured, while deleting please try later');
                                            }
                                        }
                                    });

                                }
                            }
                        }
                    });
                }
                else {
                    $('#demo_02 tr').each(function (rowIndex) {
                        if ($(this).hasClass(subTypeRowClass + 'Child')) {
                            $(this).closest('tr').remove();
                        }

                    });

                    requestedRow.closest('tr').remove();

                    subTypeRowClass = subTypeRowClass.replace('Child', '').replace(/[0-9]/g, '');
                    let typeCount = parseInt($('#demo_02 tr.' + subTypeRowClass + ' td.tdTypeCount').find('input').val());
                    $('#demo_02 tr.' + subTypeRowClass + ' td.tdTypeCount').find('input').val((typeCount - 1));
                    successToastr('Deleted successfully');
                }
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
            propertyStructureJSONObject['Code'] = $(this).find('td.tdCode').find('input').val();
            propertyStructureJSONObject['TypeName'] = $(this).find('td.tdType').text();
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
function getAllPropertyUnitTypesX() {
    ajaxRequest({
        url: '/RealEstate/Unit/GetAllUnitType', type: 'GET', data: {}, callBack: function (responseJSON) {
            allUnitTypesArray = responseJSON.resultJSON;
            ajaxRequest({ url: '/RealEstate/PropertyStructure/GetByPropertyID', type: 'POST', data: { propertyID: $('#ID').val() }, callBack: getPropertyStructureByPropertyIDCallBack });
        }
    });
}