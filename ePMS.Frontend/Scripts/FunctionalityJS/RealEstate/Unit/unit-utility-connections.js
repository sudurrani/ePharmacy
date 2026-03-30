

function addElectricityMeterRow() {  
    var insertingRow = `<tr style="background-color: whitesmoke;">
               <td class="tdElectricityMeterID" hidden><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" value="0" /></td>
               <td class="tdElectricityMeterType" hidden><input type="text" class="js-states form-control bha-input readonly w-100 mt-0" maxlength="50" value="Electricity" /></td>
               <td class="tdElectricityResidentialMeterNo"><input name=" ElectricityResidentialMeterNo" type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50"/></td>
               <td class="tdElectricityCommercialMeterNo"><input name="ElectricityCommercialMeterNo" type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
               <td class="tdElectricityIndustrialMeterNo"><input name=" ElectricityIndustrialMeterNo" type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
                <td class="tdAction text-center pt-0 pb-0">
                             
                </td>
            </tr>`;

    $('#electricityMeterTBody').append(insertingRow);  
    refreshTableActions('electricityMeterTBody', 'addElectricityMeterRow');
}
function getEelectricityMeterData() {
    //declare/define array here name it as electricityMeterArray
    var electricityMeterArray = [];
    $('#electricityMeterTBody tr').each(function (rowIndex) {
        //declare/define array here name it as electricityMeterObject
        var electricityMeterObject = {};
        //and populate object from below data
        var tdElectricityMeterID = $(this).closest('tr').find('.tdElectricityMeterID').find('input').val();
        var tdElectricityMeterType = $(this).closest('tr').find('.tdElectricityMeterType').find('input').val();
        var tdElectricityResidentialMeterNo = $(this).closest('tr').find('.tdElectricityResidentialMeterNo').find('input').val();
        var tdElectricityCommercialMeterNo = $(this).closest('tr').find('.tdElectricityCommercialMeterNo').find('input').val();
        var tdElectricityIndustrialMeterNo = $(this).closest('tr').find('.tdElectricityIndustrialMeterNo').find('input').val();


        electricityMeterObject['PremiseNo'] = $('#PremiseNo').val();
        electricityMeterObject['ID'] = tdElectricityMeterID;
        electricityMeterObject['MeterType'] = tdElectricityMeterType;
        electricityMeterObject['ResidentialMeterNo'] = tdElectricityResidentialMeterNo;
        electricityMeterObject['CommercialMeterNo'] = tdElectricityCommercialMeterNo;
        electricityMeterObject['IndustrialMeterNo'] = tdElectricityIndustrialMeterNo;

        electricityMeterArray.push(electricityMeterObject);
        //console.log(electricityMeterArray);
        //push this object to array

    });
    //return populated array
    return electricityMeterArray;
}
function addGasMeterRow() {

    var insertingRow = `<tr style="background-color: whitesmoke;">
                       <td class="tdGasMeterID" hidden><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" value="0" /></td>
                       <td class="tdGasMeterType" hidden><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" value="Gas" /></td>
                       <td class="tdGasResidentialMeterNo"><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
                       <td class="tdGasCommercialMeterNo"><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
                       <td class="tdGasIndustrialMeterNo"><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
                    <td class="tdAction text-center pt-0 pb-0">
                      </td>
            </tr>`;

    $('#gasMeterTBody').append(insertingRow);
    refreshTableActions('gasMeterTBody', 'addGasMeterRow');
}
function getGasMeterData() {
    //declare/define array here name it as gasMeterArray
    var gasMeterArray = [];
    $('#gasMeterTBody tr').each(function (rowIndex) {
        //declare/define array here name it as gasMeterObject
        var gasMeterObject = {};
        //and populate object from below data
        var tdGasMeterID = $(this).closest('tr').find('.tdGasMeterID').find('input').val();
        var tdGasMeterType = $(this).closest('tr').find('.tdGasMeterType').find('input').val();
        var tdGasResidentialMeterNo = $(this).closest('tr').find('.tdGasResidentialMeterNo').find('input').val();
        var tdGasCommercialMeterNo = $(this).closest('tr').find('.tdGasCommercialMeterNo').find('input').val();
        var tdGasIndustrialMeterNo = $(this).closest('tr').find('.tdGasIndustrialMeterNo').find('input').val();


        gasMeterObject['PremiseNo'] = $('#PremiseNo').val();
        gasMeterObject['ID'] = tdGasMeterID;
        gasMeterObject['MeterType'] = tdGasMeterType;
        gasMeterObject['ResidentialMeterNo'] = tdGasResidentialMeterNo;
        gasMeterObject['CommercialMeterNo'] = tdGasCommercialMeterNo;
        gasMeterObject['IndustrialMeterNo'] = tdGasIndustrialMeterNo;

        gasMeterArray.push(gasMeterObject);
        //console.log(gasMeterArray);
        //push this object to array

    });
    //return populated array
    return gasMeterArray;
}
function addWaterMeterRow() {

    var insertingRow = `<tr style="background-color: whitesmoke;">
                        <td class="tdWaterMeterID" hidden><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" value="0" /></td>
                        <td class="tdWaterMeterType" hidden><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" value="Water" /></td>
                        <td class="tdWaterResidentialMeterNo"><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
                        <td class="tdWaterCommercialMeterNo"><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
                        <td class="tdWaterIndustrialMeterNo"><input type="text" class="js-states form-control bha-input w-100 mt-0" maxlength="50" /></td>
                       <td class="tdAction text-center pt-0 pb-0">
                      </td>
            </tr>`;

    $('#waterMeterTBody').append(insertingRow);
    refreshTableActions('waterMeterTBody', 'addWaterMeterRow');
}
function getWaterMeterData() {
    //declare/define array here name it as waterMeterArray
    var waterMeterArray = [];
    $('#waterMeterTBody tr').each(function (rowIndex) {
        //declare/define array here name it as waterMeterObject
        var waterMeterObject = {};
        //and populate object from below data
        var tdWaterMeterID = $(this).closest('tr').find('.tdWaterMeterID').find('input').val();
        var tdWaterMeterType = $(this).closest('tr').find('.tdWaterMeterType').find('input').val();
        var tdWaterResidentialMeterNo = $(this).closest('tr').find('.tdWaterResidentialMeterNo').find('input').val();
        var tdWaterCommercialMeterNo = $(this).closest('tr').find('.tdWaterCommercialMeterNo').find('input').val();
        var tdWaterIndustrialMeterNo = $(this).closest('tr').find('.tdWaterIndustrialMeterNo').find('input').val();


        waterMeterObject['PremiseNo'] = $('#PremiseNo').val();
        waterMeterObject['ID'] = tdWaterMeterID;
        waterMeterObject['MeterType'] = tdWaterMeterType;
        waterMeterObject['ResidentialMeterNo'] = tdWaterResidentialMeterNo;
        waterMeterObject['CommercialMeterNo'] = tdWaterCommercialMeterNo;
        waterMeterObject['IndustrialMeterNo'] = tdWaterIndustrialMeterNo;

        waterMeterArray.push(waterMeterObject);
        // console.log(waterMeterArray);
        //push this object to array

    });
    //return populated array
    return waterMeterArray;

}
function removeUtilityConnectionRow(requestedRow, id = 0, tbodyID, addFunctionName) {

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
            if (isConfirm.value == true) {

                $(requestedRow).closest('tr');
                requestedRow.closest('tr').remove();
                refreshTableActions(tbodyID, addFunctionName);

            }
        });
}
function refreshTableActions(tbodyID, addFunctionName) {    
    const rows = $('#' + tbodyID + ' tr');

    rows.each(function (index) {
        const actionCell = $(this).find('td.tdAction');
        actionCell.empty(); // Clear *this* row's action cell

        const isLast = index === rows.length - 1;

        if (rows.length === 1) {
            actionCell.append(`
            <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="${addFunctionName}();"></i>          
        `);
        } else if (isLast) {
            // Last row: Show Add + Remove
            actionCell.append(`
             <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="${addFunctionName}();"></i>
              <i class="bi bi-x-circle fs-6 text-danger" style="cursor: pointer;" onclick="removeUtilityConnectionRow($(this),0,'${tbodyID}','${addFunctionName}');"></i>
            
        `);
        } else {
            // Other rows: Remove only
            actionCell.append(`
           <i class="bi bi-x-circle fs-6 text-danger" style="cursor: pointer;" onclick="removeUtilityConnectionRow($(this),0,'${tbodyID}','${addFunctionName}');"></i>
        `);
        }
    });
}

//var getUtilityConnectionsByUnitIdCallBack = function (responseJSON) {
//    alert("");
//    console.log(responseJSON.resultJSON);
//    var electricityMeterArray = responseJSON.resultJSON.filter(row => row.MeterType == 'Electricity');
//    if (electricityMeterArray.length > 0) {
//        $('#electricityMeterTBody').html('');
//    }
//    // electricity meter array each loop
//    $.each(electricityMeterArray, function (rowIndex, rowItem) {        


//        //each loop console each object

//        //in each loop generate tr data as did in button add here will set data instead of getting
//        if (rowIndex == 0) {
//            var insertingRow = `<tr>
//               <td class="tdElectricityMeterID" hidden > <input type="text" class="form-control" maxlength="50" value=`+ rowItem.ID + ` /></td>
//                <td class="tdElectricityMeterType" hidden> <input type="text" class="form-control" maxlength="50"  value=`+ rowItem.MeterType + `/></td>
//                <td class="tdElectricityResidentialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.ResidentialMeterNo + ` /></td>
//                <td class="tdElectricityCommercialMeterNo">  <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.CommercialMeterNo + ` /></td>
//                <td class="tdElectricityIndustrialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.IndustrialMeterNo + ` /></td>
//                <td> <button type='button' class='btn  btn-sm btn-primary btnAddSubType' onclick="addElectricityMeterRow(this);" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-plus'></i></b></button></td>
//            </tr>`;
//            // 
//        }
//        else {


//            var insertingRow = `<tr>
//               <td class="tdElectricityMeterID" hidden > <input type="text" class="form-control" maxlength="50" value=`+ rowItem.ID + ` /></td>
//                <td class="tdElectricityMeterType" hidden> <input type="text" class="form-control" maxlength="50"  value=`+ rowItem.MeterType + `/></td>
//                <td class="tdElectricityResidentialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.ResidentialMeterNo + ` /></td>
//                <td class="tdElectricityCommercialMeterNo">  <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.CommercialMeterNo + ` /></td>
//                <td class="tdElectricityIndustrialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.IndustrialMeterNo + ` /></td>
//                <td> <button type='button' class='btn  btn-sm btn-danger btnAddSubType' onclick="" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-close'></i></b></button></td>
//            </tr>`;
//        }
//        //append generated tr to table tbody
//        $('#electricityMeterTBody').append(insertingRow);
//    });
//    //gas meter array filter
//    var gasMeterArray = responseJSON.resultJSON.filter(row => row.MeterType == 'Gas');
//    if (gasMeterArray.length > 0) {
//        $('#gasMeterTBody').html('');
//    }
//    // Gas meter array each loop
//    $.each(gasMeterArray, function (rowIndex, rowItem) {
     


//        //each loop console each object

//        //in each loop generate tr data as did in button add here will set data instead of getting

//        var insertingRow = `<tr>
//                <td class="tdGasMeterID" hidden ><input type="text" class="form-control" maxlength="50" value=`+ rowItem.ID + ` /></td>
//                <td class="tdGasMeterType" hidden> <input type="text" class="form-control" maxlength="50"  value=`+ rowItem.MeterType + `/></td>
//                <td class="tdGasResidentialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.ResidentialMeterNo + ` /></td>
//                <td class="tdGasCommercialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.CommercialMeterNo + ` /></td>
//                <td class="tdGasIndustrialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.IndustrialMeterNo + ` /></td>
//                <td> <button type='button' class='btn  btn-sm btn-danger btnAddSubType' onclick="" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-close'></i></b></button></td>
//            </tr>`;
//        //append generated tr to table tbody
//        $('#gasMeterTBody').append(insertingRow);
//    });

//    var WaterMeterArray = responseJSON.resultJSON.filter(row => row.MeterType == 'Water');
//    if (WaterMeterArray.length > 0) {
//        $('#waterMeterTBody').html('');
//    }
//    // Water meter array each loop
//    $.each(WaterMeterArray, function (rowIndex, rowItem) {
        


//        //each loop console each object

//        //in each loop generate tr data as did in button add here will set data instead of getting

//        var insertingRow = `<tr>
//               <td class="tdWaterMeterID" hidden >    <input type="text" class="form-control" maxlength="50" value=`+ rowItem.ID + ` /></td>
//                <td class="tdWaterMeterType" hidden>   <input type="text" class="form-control" maxlength="50"  value=`+ rowItem.MeterType + `/></td>
//                <td class="tdWaterResidentialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.ResidentialMeterNo + ` /></td>
//                <td class="tdWaterCommercialMeterNo">  <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.CommercialMeterNo + ` /></td>
//                <td class="tdWaterIndustrialMeterNo"> <input  type="text" class="form-control" maxlength="50" value=`+ rowItem.IndustrialMeterNo + ` /></td>
//                <td> <button type='button' class='btn  btn-sm btn-danger btnAddSubType' onclick="" style="padding: 0;width: 2.38rem;height: 2.35rem;padding-top: 0.1rem;"><b><i class='icon s7-close'></i></b></button></td>
//            </tr>`;
//        //append generated tr to table tbody
//        $('#waterMeterTBody').append(insertingRow);
//    });

//}    