var _variantAttributesArray = [],
    _serviceVariantAttributesArrays = [];
var _taxTypesArray = [], _taxGroupsArray = [], _taxDetailsArray = [];
//Schema
let variantSchema = {
    ID: { type: 'hidden' },
    VariantID: { type: 'hidden' },
    Variant: { type: 'text', maxlength: 50, isReadOnly: true },
    AttributesID: {
        type: 'select', isMultiple: true, options: [] //| We will get Variant Attributes on Variant select event then will set to this options key
    },

    //| Action Column Schema
    //| If add icon is not required do not provide add function
    //| If delete icon is not required do not provide delete function
    Action: { type: 'action', addRowFunction: null, removeRowFunction: 'deleteVariantRow' }
};
let customerSchema = {
    ID: { type: 'hidden' },
    CustomerID: {
        type: 'select', isMultiple: false, options: []
    },
    CurrencyID: {
        type: 'select', isMultiple: false, options: []
    },
    Rate: { type: 'text', maxlength: 50, isReadOnly: false },
    Discount: { type: 'number', maxlength: 50, isReadOnly: false },
    IsPrimaryCustomer: { type: 'checkbox', isChecked: false },
    IsSaleInvoice: { type: 'checkbox', isChecked: false },
    IsSaleOrder: { type: 'checkbox', isChecked: false },
    //| Action Column Schema
    //| If add icon is not required do not provide add function
    //| If delete icon is not required do not provide delete function
    Action: { type: 'action', addRowFunction: 'addCustomerRow', removeRowFunction: 'deleteCustomerRow' }
};
let taxSetupSchema = {
    ID: { type: 'hidden' },
    TaxGroupID: {
        type: 'select', isMultiple: false, options: []
    },
    TaxDetailID: {
        type: 'select', isMultiple: false, options: []
    },
    TaxTypeID: {
        type: 'select', isMultiple: false, options: [{ Value: '0', Text: 'Select Tax Type' },{ Value: '1', Text: 'Sale' }, { Value: '2', Text: 'Purchase' }]
    },
    Description: { type: 'text', maxlength: 50, isReadOnly: false },
    Code: { type: 'number', maxlength: 50, isReadOnly: false },
    ShortName: { type: 'text', maxlength: 50, isReadOnly: false },
    Rate: { type: 'text', maxlength: 50, isReadOnly: false },
    Remarks: { type: 'text', maxlength: 50, isReadOnly: false },
    ApplicableDate: { type: 'datepicker', maxlength: 50, isReadOnly: false },
    DiscontinueDate: { type: 'datepicker', maxlength: 50, isReadOnly: false },     
    IsActive: { type: 'checkbox', isChecked: false },
  
    //| Action Column Schema
    //| If add icon is not required do not provide add function
    //| If delete icon is not required do not provide delete function
    Action: { type: 'action', addRowFunction: 'addTaxSetupRow', removeRowFunction: 'deleteTaxSetupRow' }
};
$(document).ready(function () {
    $("select.selector_2").select2({
        width: "100%",
        placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });
    getAllTaxType();
    getAllTaxGroup();

    $(document).on('change', '#TaxSetupTableTbody .select_TaxGroupID', function () {       
        let $row = $(this).closest('tr');
        let taxGroupID = $(this).val();
        let $taxGroupDetailSelect = $row.find('.select_TaxDetailID'); 
        
        $taxGroupDetailSelect.empty().append('');

        if (!taxGroupID || taxGroupID === "0") {
            $taxGroupDetailSelect.html('<option value="">Select Tax Detail</option>');
            $row.find('td input').val('');           
            return;
        }
       
        ajaxRequest({url: '/CompanyManagement/TaxGroup/GetTaxGroupDetailByTaxGroup',type: 'POST',data: { ID: taxGroupID }, callBack: function (responseJSON) {
            let taxDetailData = JSON.parse(responseJSON);              
            $taxGroupDetailSelect.empty().append('<option value="">Select Tax Detail</option>');
                $row.find('td input').val('');                 

            $.each(taxDetailData, function (index, item) {
                $taxGroupDetailSelect.append(
                        $('<option>', { value: item.ID, text: item.Description })
                    );
                });
             
            $taxGroupDetailSelect.select2({
                    width: "100%",
                    placeholder: "Select Tax Detail",
                    minimumResultsForSearch: 0
                });
            }
        });
    });
    $(document).on('change', '#TaxSetupTableTbody .select_TaxDetailID', function () {       
        let $row = $(this).closest('tr');
        let taxDetailID = $(this).val();

        if (!taxDetailID || taxDetailID === "0") {
            $row.find('td input').val('');           
            return;
        }
        ajaxRequest({url: '/CompanyManagement/TaxGroup/GetTaxGroupDetailByID', type: 'POST', data: { ID: taxDetailID }, callBack: function (responseJSON) {
            let taxGroupDetailData = JSON.parse(responseJSON);
                $row.find('td input').val('');               

            if (taxGroupDetailData && taxGroupDetailData.length > 0) {
                let item = taxGroupDetailData[0];
                    $row.find('td.tdCode input').val(item.Code || '');
                    $row.find('td.tdShortName input').val(item.ShortName || '');
                    $row.find('td.tdDescription input').val(item.Description || '');
                    $row.find('td.tdRate input').val(item.Rate || '');
                }
            }
        });

    });


    $('#VariantID').on('select2:select', function () {
        /*
        ajaxRequest({
            url: '/Services/Dropdowns/Get', type: 'POST', data: { Table: '[Setup.ServiceVariantAttribute]', Condition: 'WHERE IsDeleted = 0 AND ServiceVariantID = '+$(this).val()+'' }, callBack: function (responseJSON) {
                if (responseJSON.IsSuccess) {
                    _variantAttributesArray = responseJSON.resultJSON;                    
                }
            }
        });
        */
        _variantAttributesArray = _serviceVariantAttributesArrays.filter(row => row.ServiceVariantID == $(this).val());
    });

    $('#btnSave').click(function (e) {
        e.preventDefault();
        saveRecord();
    });
    $('#btnClose').click(function () {
        redirectToServiceItemList();
    });   


});
function addCustomerRow(id, requestRow) {
    addTableRowsBySchema(customerSchema, 'CustomerTableTbody', {});
    resetTableActions('CustomerTableTbody');
}
function addTaxSetupRow(id, requestRow) {
    addTableRowsBySchema(taxSetupSchema, 'TaxSetupTableTbody', {});
    resetTableActions('TaxSetupTableTbody');
}
function addNewVariant() {
    if ($('#VariantID').val() <= 0) {
        infoToastr('first select variant');
        return;
    }
    let selectedVariant = $('#VariantID option:selected').text().trim();
    let isVarianExists = false;

    $('#VariantTableTbody tr').each(function () {
        let tdVariant = $(this).find('td.tdVariant input').val().trim();;
        if (tdVariant === selectedVariant) {
            isVarianExists = true;
            return false;
        }
    });
    if (isVarianExists) {
        infoToastr(`Variant "${selectedVariant}" already exists`, "Info");
        return;
    }

    variantSchema.AttributesID['options'] = _variantAttributesArray;

    addTableRowsBySchema(variantSchema, 'VariantTableTbody', { ID: 0, VariantID: $('#VariantID').val(), Variant: $('#VariantID option:selected').text(), AttributesID: 2 });
}
function deleteVariantRow(id, requestedRow) {
    let $row = $(requestedRow).closest("tr");
    let variantID = $row.find(".tdID").text().trim();
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `Do you want to delete this row`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(function (isConfirm) {
        if (isConfirm.value == true) {
            if (id <= 0) {
                $row.remove();
                return;
            }
            else {
                ajaxRequest({
                    url: "/Services/ServiceItem/DeleteVariant", type: 'POST', data: { ID: variantID }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();  
                            successToastr(responseJSON.Message, 'success');
                        }
                        else {
                            errorToastr("Your operation Canceled :)", "error");
                        }
                    }
                });  
            }
        }
        else {
            errorToastr("Your operation Canceled :)", "error");
        }
    });
}
function deleteCustomerRow(id, requestedRow) {
    let $row = $(requestedRow).closest("tr");
    let customerID = $row.find(".tdID").text().trim();
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `Do you want to delete this row`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(function (isConfirm) {
        if (isConfirm.value == true) {
            if (id <= 0) {
                $row.remove();
                resetTableActions('CustomerTableTbody', 'addCustomerRow', null);
                return;
            }
            else {
                ajaxRequest({
                    url: "/Services/ServiceItem/DeleteCustomer", type: 'POST', data: { ID: customerID }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();
                            successToastr(responseJSON.Message, 'success');
                            resetTableActions('CustomerTableTbody', 'addCustomerRow', null);
                        }
                        else {
                            errorToastr("Your operation Canceled :)", "error");
                        }
                    }
                });               
            }
        }
        else {
            errorToastr("Your operation Canceled :)", "error");
        }
    });
}

function deleteTaxSetupRow(id, requestedRow) {
    let $row = $(requestedRow).closest("tr");
    let taxSetupID = $row.find(".tdID").text().trim();
    swal.fire({
        title: swalConfirmTitle,
        type: "warning",
        text: `Do you want to delete this row`,
        showCancelButton: true,
        confirmButtonText: swalConfirmButtonText,
        cancelButtonText: swalConfirmCancelButtonText,
        closeOnConfirm: false,
        closeOnCancel: true
    }).then(function (isConfirm) {
        if (isConfirm.value == true) {
            if (id <= 0) {
                $row.remove();
                resetTableActions('TaxSetupTableTbody', 'addTaxSetupRow', null);
                return;
            }
            else {               
                ajaxRequest({
                    url: "/Services/ServiceItem/DeleteTaxSetup", type: 'POST', data: { ID: taxSetupID }, callBack: function (responseJSON) {
                        if (responseJSON.IsSuccess) {
                            $row.remove();
                            successToastr(responseJSON.Message, 'success');
                            resetTableActions('CustomerTableTbody', 'addCustomerRow', null);
                        }
                        else {
                            errorToastr("Your operation Canceled :)", "error");
                        }
                    }
                }); 
            }
        }
        else {
            errorToastr("Your operation Canceled :)", "error");
        }
    });
}
function saveRecord(isCloseAndSaveAsDraft = false) {
    let variants = getTableRowsBySchema(variantSchema, 'VariantTableTbody');
    let variantData = variants.map(v => ({
        VariantID: v.VariantID,
        Attributes: (v.AttributesID || []).join(',')
    }));
    //console.log(JSON.stringify(variant));

    if (customValidateForm('ServiceItemForm')) {
        let customers = getTableRowsBySchema(customerSchema, 'CustomerTableTbody');
        let taxSetups = getTableRowsBySchema(taxSetupSchema, 'TaxSetupTableTbody');
        for (let i = 0; i < variantData.length; i++) {
            let rowNo = i + 1;

            if (!variantData[i].Attributes || variantData[i].Attributes.trim() === "") {
                infoToastr(`Variant table row ${rowNo}: Attributes is missing`);
                return;
            }
        }
        for (let i = 0; i < customers.length; i++) {
            let c = customers[i], rowNo = i + 1;

            if (!c.CustomerID || c.CustomerID === "0") return infoToastr(`Customer table row ${rowNo}: Customer Name is missing`);
            if (!c.Rate || Number(c.Rate) <= 0) return infoToastr(`Customer table row ${rowNo}: Rate is missing`);
            //if (!c.Discount || Number(c.Discount) <= 0) return infoToastr(`Customer table row ${rowNo}: Discount is missing`);
        }       
        for (let i = 0; i < taxSetups.length; i++) {
            let t = taxSetups[i], rowNo = i + 1;

            if (!t.TaxGroupID || t.TaxGroupID === "0") return infoToastr(`Tax Setup table row ${rowNo}: Tax Group is missing`);
            if (!t.TaxDetailID || t.TaxDetailID === "0") return infoToastr(`Tax Setup table row ${rowNo}: Tax Group Detail is missing`);
            if (!t.TaxTypeID || t.TaxTypeID === "0") return infoToastr(`Tax Setup table row ${rowNo}: Tax Type is missing`);
        }

        var inputJSON = getFormDataAsJSONObject('ServiceItemForm');
        inputJSON = getFormDataAsJSONObject('SpecificationForm', inputJSON);
        inputJSON['Variants'] = variantData;
        inputJSON['Customers'] = customers;
        inputJSON['TaxSetups'] = taxSetups;
        ajaxRequest({ url: "/Services/ServiceItem/Save", type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });

    }
}
function saveRecordCallBack(responseJSON, options) {
    if (responseJSON.IsSuccess) {
        successToastr("The Service Item has been saved", 'success');
        $("#ID").val(responseJSON.resultJSON);  
        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/Services/ServiceItem/List?FID=fVZFcZW3+pwAgWyGPOtYrg==&ModuleID=stgRMCl4UuaRIz1dElDqYA==';
            }, 2000);
        }
    }    
    else {
        errorToastr("", responseJSON.Message, responseJSON);
    }
}
//Btn Close Code
function redirectToServiceItemList() {
    swal.fire({
        title: "",
        text: 'Do you want save changes?',
        type: 'info',
        cancelButtonColor: '#F04249',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        dangerMode: true,
        allowOutsideClick: false,
    }).then(
        function (isConfirm) {
            if (isConfirm.value == true) {
                saveRecord(true);
            }
            else {
                window.location.href = '/Services/ServiceItem/List?FID=fVZFcZW3+pwAgWyGPOtYrg==&ModuleID=stgRMCl4UuaRIz1dElDqYA==';
            }
        });

};
//Btn Close End Code
function getAllTaxType() {   
    ajaxRequest({
        url: '/Product/GetTaxTypeAll', type: 'POST', data: {}, callBack: function (responseJSON) {                  
            $.each(JSON.parse(responseJSON), function (index, item) {
                _taxTypesArray.push({
                    Value: item.ID,
                    Text: item.Description
                });
            }) 
            _taxTypesArray.unshift({ Value: 0, Text: 'Select Tax Type' });
        }
    });
   
}
function getAllTaxGroup() {   
    ajaxRequest({
        url: '/TaxGroupDetail/GetAllIndirectTax', type: 'POST', data: {}, callBack: function (responseJSON) {
           
            $.each(responseJSON, function (i, Data) {
                var Vat = "";
                var GST = "";
                var SalesTax = "";
                var Intax = "";
                if (Data.VAT == 1) { Vat = "VAT-"; } if (Data.GST == 1) { GST = "GST-"; } if (Data.SalesTax == 1) { SalesTax = "SalesTax-"; }
                Intax = Vat + "" + GST + "" + SalesTax + "(" + Data.Code + ")";
                _taxGroupsArray.push({Value: Data.ID, Text: Intax });
            })
            _taxGroupsArray.unshift({ Value: 0, Text: 'Select Tax Group' });
        }
    });

}
