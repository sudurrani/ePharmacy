let _productNoArray = [], _productNameArray = [], _warehouseNameArray = [], invoicesList = [];
var currentInvoiceIndex = 0;
$(document).ready(function () {
    $("select.selector_2").select2({
        width: "100%",
        //placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });
    loadPaymentMethodsDropdownList('PaymentMethodID', 0, 'Select Payment Method');
    loadCustomerContactsDropdownList('CustomerID', 0, null, { text: 'Add New Customer', function: 'addNewCustomer' });
    //$('#PaymentMethodID').on('select2:select', function () {
    //    loadCustomersByPaymentMethodDropdownList('CustomerID', 0, $(this).val());
    //});
    datePickerDDMMYYYYFormat('InvoiceDate', true);
    getAllProductNumber();
    getAllProductName();
    getCompanyDefaultCurrency();
    getNumber();
    $('#CurrencyID').change(checkCurrencyMatch);
    $(document).on("input", ".price, .addEnterQty, .vat", function () {
        let $row = $(this).closest("tr");
        calculateProductVat($row);
    });
    $(document).on("change", ".ddlItemNo", function () {
        let selectedVal = $(this).val();
        let $row = $(this).closest("tr");
        const $warehouseDropdown = $row.find(".ddlWarehouse");
        $row.find(".ddlItemName").val(selectedVal).trigger("change.select2");
        getWarehousesByProduct(selectedVal, $warehouseDropdown);
        getProductVat($row);
    });

    $(document).on("change", ".ddlItemName", function () {
        let selectedVal = $(this).val();
        let $row = $(this).closest("tr");
        $row.find(".ddlItemNo").val(selectedVal).trigger("change");
    });

    $("#Barcode").on("keypress", function (e) {
        if (e.which === 13) {
            e.preventDefault();
            let barcode = $(this).val().trim();

            if (barcode === "") {
                infoToastr("Please enter a barcode", "Info");
                return;
            }
            ajaxRequest({
                url: "/PointOfSale/ProductSearch/GetByBarcode",
                type: "POST",
                data: { Barcode: barcode },
                callBack: function (responseJSON) {
                    if (responseJSON.IsSuccess && responseJSON.resultJSON != null) {

                        let product = responseJSON.resultJSON;
                        let $tbody = $("#addToCartTable tbody");
                        let $existingRow = $tbody.find("tr").filter(function () {
                            let idText = $(this).find(".tdID").text().trim();
                            return idText !== "" && idText == product.ID;
                        });

                        if ($existingRow.length > 0) {
                            infoToastr(`Product "${product.ItemName}" already exists in cart`, "Info");
                        } else {

                            if ($tbody.find("tr").length === 1 && $tbody.find(".tdID").text().trim() === "0") {
                                $tbody.empty();
                            }

                            addToCartRow(product);
                        }

                        $("#Barcode").val("").focus();
                    } else {
                        infoToastr("Item not found", "Info");
                        $("#Barcode").val("").focus();
                    }
                }
            });
        }
    });
    $("#ProductSearchTab").on("click", function () {
        $(".fophex-tab-item").removeClass("flex-active");
        $("#productSearchFlex").addClass("flex-active");
        $("#globalSearch").show();
        $(".invoicesearchpanel").hide();
        $('#PrintContainer').removeClass('d-none');
        $("#btnSave, #btnPost").hide();

    });
    $("#InvoicesTab").on("click", function () {
        $("#globalSearch").hide();      
        $(".invoicesearchpanel").hide();      
        $("#btnSave, #btnPost").hide();
        $('#PrintContainer').removeClass('d-none');
    });
    $("#SaleInvoiceTab").on("click", function () {        
        $(".invoicesearchpanel").show();
        $(".fophex-tab-item").removeClass("flex-active");
        $("#invoiceSearchFlex").addClass("flex-active");
        $("#globalSearch").hide();       
        $("#btnSave, #btnPost").show();
        $('#PrintContainer').addClass('d-none');
        let $tbody = $("#addToCartTable tbody");
        if (_addToCartArray.length > 0) {
            $tbody.find("tr").each(function () {
                const id = parseInt($(this).find(".tdID").text().trim());
                if (id == 0) {
                    $(this).remove();
                    refreshTableActions();
                }
            });
            _addToCartArray.forEach(function (item) {
                let isAlreadyInTable = false;
                $tbody.find("tr").each(function () {
                    let existingID = $(this).find(".tdID").text().trim();
                    if (existingID == item.ID) {
                        isAlreadyInTable = true;
                        return false;
                    }
                });
                if (!isAlreadyInTable) {
                    addToCartRow(item, false);
                }
            });
        } else {
            $tbody.empty();
            addToCartRow(null, false);
        }
    });
    $(document).on("click", ".addEnterQty", function () {
        let $row = $(this).closest("tr");
        openVariantQuantityModal($row);
        $("#btnAddToCartRow").hide();
        $("#btnAddQtyToCartRow").show();

    });
    $('#btnAddQtyToCartRow').click(function () {
        let totalQty = 0;
        let productId = null;
        let warehouseID = null;
        let variantTypeID = null;
        let variantDetailIDs = [];
        $('#tblVariant tbody tr').each(function () {
            const qtyVal = parseFloat($(this).find('.enterQty').val()) || 0;
            const variantDetailID = $(this).find('.tdVariantDetailID').text().trim();
            if (qtyVal > 0) {
                totalQty += qtyVal;
                if (variantDetailID && !variantDetailIDs.includes(variantDetailID)) {
                    variantDetailIDs.push(variantDetailID);
                }
            }
            if (productId === null) {
                productId = $(this).find('.tdID').text().trim();
                warehouseID = $(this).find('.tdWarehouseID').text().trim();
                variantTypeID = $(this).find('.tdVariantTypeID').text().trim();
            }
        });
        const variantDetailIDsText = variantDetailIDs.join(',');
        $('#addToCartTable tbody tr').each(function () {
            const rowProductId = $(this).find(".ddlItemNo").val();
            if (rowProductId === productId) {
                $(this).find('.addEnterQty').text(totalQty.toFixed(2));
                $(this).find('.tdVariantTypeID').text(variantTypeID || '0');
                $(this).find('.tdVariantDetailID').text(variantDetailIDsText);
                $(this).find('.tdWarehouseID').text(warehouseID);
                calculateProductVat($(this).closest("tr"));
            }
        });
        $('#modalVariant').modal('hide');
    });
    $(document).on("focusout", "#tblVariant .enterQty", function () {
        let $input = $(this);
        let $row = $input.closest("tr");
        let availableQty = parseFloat($row.find(".tdQuantity").text().trim()) || 0;
        let enteredQty = parseFloat($input.val().trim()) || 0;
        let compoundVariant = $row.find(".tdCompoundVariant").text().trim();
        if (enteredQty > availableQty) {
            swal.fire('Info', `Quantity cannot be more than Available Quantity(${availableQty})`);
            $input.val(0);
            $input.focus();
        }
    });
    $('#btnSave').click(function () {
        let isError = false;
        let message = '';

        $('#addToCartTable tbody tr').each(function (index) {
            let $row = $(this);
            let rowNumber = index + 1;
            let selectItemNo = $row.find('td.tdItemNo select').val();
            let selectQuantity = parseFloat($row.find('td.tdQuantity').text().trim()) || 0;
            let selectItemName = $row.find('td.tdItemName select option:selected').text().trim();
            //let selectWarehouse = $row.find('td.tdWarehouse select option:selected').text().trim();

            if (selectItemNo === '0' || selectItemNo === '' || selectItemNo == null) {
                message = `Select Item No in row ${rowNumber}`;
                isError = true;
                return false;
            }
            else if (selectQuantity === 0) {
                message = `Add Quantity for "${selectItemName}" in row ${rowNumber}`;
                isError = true;
                return false;
            }
            //else if (selectWarehouse === '' || selectWarehouse.toLowerCase() === 'select warehouse') {
            //    message = `Select Warehouse for "${selectItemName}" in row ${rowNumber}`;
            //    isError = true;
            //    return false;
            //}
        });
        if (isError) {
            infoToastr(message, "Info");
            return;
        }
        swal.fire({
            title: "Confirmation",
            text: 'Do you want to save draft?',
            type: 'info',
            cancelButtonColor: '#F04249',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            dangerMode: true,
            allowOutsideClick: false,
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                saveRecord(false);
            } else {
                errorToastr("Your operation Canceled :)", "error");
            }
        });
    });
    $('#btnPost').click(function () {
        let isError = false;
        let message = '';

        $('#addToCartTable tbody tr').each(function (index) {
            let $row = $(this);
            let rowNumber = index + 1;
            let selectItemNo = $row.find('td.tdItemNo select').val();
            let selectQuantity = parseFloat($row.find('td.tdQuantity').text().trim()) || 0;
            let selectItemName = $row.find('td.tdItemName select option:selected').text().trim();
            //let selectWarehouse = $row.find('td.tdWarehouse select option:selected').text().trim();

            if (selectItemNo === '0' || selectItemNo === '' || selectItemNo == null) {
                message = `Select Item No in row ${rowNumber}`;
                isError = true;
                return false;
            }
            else if (selectQuantity === 0) {
                message = `Add Quantity for "${selectItemName}" in row ${rowNumber}`;
                isError = true;
                return false;
            }
            //else if (selectWarehouse === '' || selectWarehouse.toLowerCase() === 'select warehouse') {
            //    message = `Select Warehouse for "${selectItemName}" in row ${rowNumber}`;
            //    isError = true;
            //    return false;
            //}
        });
        if (isError) {
            infoToastr(message, "Info");
            return;
        }
        swal.fire({
            title: "Confirmation",
            text: 'Do you want to post this record?',
            type: 'info',
            cancelButtonColor: '#F04249',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            dangerMode: true,
            allowOutsideClick: false,
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                saveRecord(true);
            } else {
                errorToastr("Your operation Canceled :)", "error");
            }
        });
    });
    $("#InvoicesTab").on("click", function () {
        loadInvoicesTableData();
    });
    $(document).on('click', '#InvoicesTable tbody tr', function () {
        currentInvoiceIndex = $(this).index();
        highlightSelectedInvoiceRow();
    });
    $("#btnPrevInvoice").on("click", function () {
        if (currentInvoiceIndex > 0) {
            currentInvoiceIndex--;
            highlightSelectedInvoiceRow();
        } else {
            infoToastr("Already at first invoice");
        }
    });

    $("#btnNextInvoice").on("click", function () {
        if (currentInvoiceIndex < invoicesList.length - 1) {
            currentInvoiceIndex++;
            highlightSelectedInvoiceRow();
        } else {
            infoToastr("Already at last invoice");
        }
    });
});
function getNumber() {
    ajaxRequest({ url: '/PointOfSale/ProductSearch/GetNumber', type: 'POST', data: {}, callBack: getNumberCallBack }, null, false);
}
var getNumberCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        $('#InvoiceNo').val(responseJSON.resultJSON.Number);
        $('#InvoiceNo').prop('readonly', true);
    }
    else {
        $('#InvoiceNo').prop('readonly', false);
    }
}
function addToCartRow(item = null, selectItemNo = true) {
    if (selectItemNo) {
        let isInvalid = false;
        $('#addToCartTable tbody tr').each(function (index) {
            let $row = $(this);
            let rowNumber = index + 1;
            let selectedItemNo = $row.find('td.tdItemNo select').val();

            if (selectedItemNo === '0' || selectedItemNo === '' || selectedItemNo == null) {
                infoToastr(`Select Item No in row ${rowNumber}`, "Info");
                isInvalid = true;
                return false;
            }
        });
        if (isInvalid) return;
    }
    let productNoOptions = '';
    let productNameOptions = '';
    if (item == null) {
        productNoOptions = `<option value="0" selected>Select Item No</option>`;
        productNameOptions = `<option value="0" selected>Select Item Name</option>`;
    }
    else {
        productNoOptions = `<option value="0">Select Item No</option>`;
        productNameOptions = `<option value="0">Select Item Name</option>`;
    }

    let selectedProductIds = [];
    $("#addToCartTable tbody tr").each(function () {
        let selectedVal = $(this).find(".ddlItemNo").val();
        if (selectedVal && selectedVal != "0") {
            selectedProductIds.push(selectedVal);
        }
    });

    $.each(_productNoArray, function (index, rowItem) {
        let isDisabled = selectedProductIds.includes(rowItem.Value.toString()) && (!item || item.ID != rowItem.Value);
        if (item) {
            if (item && item.ID == rowItem.Value) {
                productNoOptions += `<option value="${rowItem.Value}" selected>${rowItem.Text}</option>`;
            } else {
                productNoOptions += `<option value="${rowItem.Value}" ${isDisabled ? "disabled" : ""}>${rowItem.Text}</option>`;
            }
        }
        else {
            productNoOptions += `<option value="${rowItem.Value}" ${isDisabled ? "disabled" : ""}>${rowItem.Text}</option>`;

        }
    });
    $.each(_productNameArray, function (index, rowItem) {
        let isDisabled = selectedProductIds.includes(rowItem.Value.toString()) && (!item || item.ID != rowItem.Value);
        if (item) {

            if (item && item.ID == rowItem.Value) {

                productNameOptions += `<option value="${rowItem.Value}" selected>${rowItem.Text}</option>`;
            } else {

                productNameOptions += `<option value="${rowItem.Value}" ${isDisabled ? "disabled" : ""}>${rowItem.Text}</option>`;
            }
        }
        else {
            productNameOptions += `<option value="${rowItem.Value}" ${isDisabled ? "disabled" : ""}>${rowItem.Text}</option>`;

        }
    });
    let price = (item?.Price ?? 0).toFixed(2);
    let vat = (item?.VAT ?? 0).toFixed(2);
    let totalExclVat = (0).toFixed(2);
    let totalInclVat = (0).toFixed(2);
    let quantity = (item?.Quantity ?? 0).toFixed(2);
    let rowHtml = `
        <tr>
            <td class="tdID" hidden>${item ? item.ID : 0}</td>
            <td class="tdWarehouseID" hidden>${item ? item.WarehouseID : 0}</td>
            <td class="tdUOMID" hidden>${item ? item.UOMID : 0}</td>
            <td class="tdAccountHeadID" hidden>${item ? item.AccountHeadID : 0}</td>            
            <td class="tdItemTypeID" hidden>${item ? item.ItemTypeID : 0}</td>            
            <td class="tdVariantTypeID" hidden>${item ? item.VariantTypeID : 0}</td>
            <td class="tdVariantDetailID" hidden>${item ? item.VariantDetailID : 0}</td>
            <td class="tdItemNo">
                <div class="selector" style="margin-top: 0px !important">
                    <select class="form-control selector_2 w-100 ddlItemNo">  
                    ${productNoOptions}
                    </select>
                </div>
            </td>
            <td class="tdItemName">
                <div class="selector" style="margin-top: 0px !important">
                    <select class="form-control selector_2 w-100 ddlItemName"> 
                     ${productNameOptions}
                    </select>
                </div>
            </td>            
              <td class="tdPrice">
                  <div class="selector" style="margin-top: 0px !important">
                  <input class="form-control bha-input w-100 price mt-0 text-end" value="${price}"/>                     
                  </div>
                </td>
            <td class="tdQuantity">
            <span class="addEnterQty fw-bold green d-block text-end" style="cursor:pointer;" data-id="${item ? item.ID : 0}">${quantity}</span>
                
            </td>
            <td class="tdTotalexclVat">
                <div class="selector" style="margin-top: 0px !important">
                    <input class="form-control bha-input w-100 totalExclVat readonly mt-0 text-end" value="${totalExclVat}"/>
                </div>
            </td>
            <td class="tdVat">
                <div class="selector" style="margin-top: 0px !important">
                    <input class="form-control bha-input w-100 vat readonly mt-0 text-end" value="${vat}">
                </div>
            </td>
            <td class="tdTotalInclVAT">
                <div class="selector" style="margin-top: 0px !important">
                    <input class="form-control bha-input w-100 totalInclVat readonly mt-0 text-end" value="${totalInclVat}"/>
                </div>
            </td>
            <td class="tdAction text-center pt-0 pb-0">                
                
            </td>
        </tr>
    `;
    $("#addToCartTable tbody").append(rowHtml);
    const $rows = $("#addToCartTable tbody tr").last();
    const $warehouseDropdown = $rows.find(".ddlWarehouse");
    calculateProductVat($rows);
    refreshTableActions();
    if (item) {
        getWarehousesByProduct(item.ID, $warehouseDropdown);
    }
    // Apply select2
    $("select.ddlItemNo,select.ddlItemName,select.ddlWarehouse").select2({
        width: "100%",
        //placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
}
function getAllProductNumber(itemTypeId, selectedValue, defaultText = null, selectedText) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPInventorySuite.dbo.PrdProductItem', Columns: "ID Value, ItemNo Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            _productNoArray = responseJSON.resultJSON;
        }
    });
}
function getAllProductName(itemTypeId, selectedValue, defaultText = null, selectedText) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get', type: 'POST', data: {
            Table: 'BHAERPInventorySuite.dbo.PrdProductItem', Columns: "ID Value, DisplayName Text", Condition: 'WHERE IsActive = 1'
        }, callBack: function (responseJSON) {
            _productNameArray = responseJSON.resultJSON;
        }
    });
}
function removeCartRow(requestedRow) {
    let $tbody = $("#addToCartTable tbody");
    let $row = $(requestedRow).closest("tr");
    let productID = $row.find('td.tdID').text().trim();
    let variantTypeID = $row.find('.tdVariantTypeID').text().trim();
    let variantDetailID = $row.find('.tdVariantDetailID').text().trim();
    if (productID <= 0) {
        $row.remove();
        const rows = $("#addToCartTable tbody tr");
        refreshTableActions(rows);
        successToastr(`row removed`, 'info')
        return;
    }
    else {
        let index = _addToCartArray.findIndex((row) => row.ID == productID && row.VariantTypeID == variantTypeID &&
            row.VariantDetailID == variantDetailID
        );
        if (index >= 0) {
            _addToCartArray.splice(index, 1);
            $row.remove();
            const rows = $("#addToCartTable tbody tr");
            refreshTableActions(rows);
            successToastr(`row removed`, 'info')


        } else {
            $row.remove();
            const rows = $("#addToCartTable tbody tr");
            refreshTableActions(rows);
            successToastr(`row removed`, 'info')
        }
        if (_addToCartArray.length == 0) {
            $("#btnClearCart").hide();
        }
    }
    calculateTotalInclVATAmount();
}
function refreshTableActions() {
    let $rows = $("#addToCartTable tbody tr")
    $rows.each(function (index) {
        const actionCell = $(this).find('td.tdAction');
        actionCell.empty(); // Clear *this* row's action cell

        const isLast = index === $rows.length - 1;

        if ($rows.length === 1) {
            actionCell.append(`
            <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addToCartRow(null,true);"></i>         
        `);
        } else if (isLast) {
            // Last row: Show Add + Remove
            actionCell.append(`
             <i class="bi bi-plus-circle fs-6 green me-2" style="cursor:pointer;" onclick="addToCartRow(null,true);"></i>         
             <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeCartRow(this);"></i>
            
        `);
        } else {
            // Other rows: Remove only
            actionCell.append(`
           <i class="bi bi-x-circle fs-6 text-danger" style="cursor:pointer;" onclick="removeCartRow(this);"></i>
        `);
        }
    });
}
function getProductVat(requestedRow) {
    let productID = requestedRow.find('.ddlItemNo').val();
    ajaxRequest({
        url: "/PointOfSale/ProductSearch/GetProductTax", type: 'POST', data: { ID: productID }, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess && responseJSON.resultJSON != null) {
                requestedRow.find('td.tdID').text(responseJSON.resultJSON.ID);
                requestedRow.find('td.tdVat').find('input').val(responseJSON.resultJSON.TaxRate);
                requestedRow.find('td.tdPrice').find('input').val(responseJSON.resultJSON.Price);
                requestedRow.find('td.tdAccountHeadID').text(responseJSON.resultJSON.AccountHeadID);
                requestedRow.find('td.tdUOMID').text(responseJSON.resultJSON.UOMID);
                requestedRow.find('td.tdItemTypeID').text(responseJSON.resultJSON.ItemTypeID);
            }
            else {
                requestedRow.find('td.tdVat').find('input').val(0);
                requestedRow.find('td.tdPrice').find('input').val(0);
                requestedRow.find('td.tdAccountHeadID').text('0');
                requestedRow.find('td.tdUOMID').text('0');
                requestedRow.find('td.tdItemTypeID').text('0');
                requestedRow.find('td.tdID').text('0');
            }
            calculateProductVat(requestedRow);
        }
    });
}
//Calculation of Total incl & excl Amount function
function calculateProductVat(requestedRow) {
    let price = parseFloat(requestedRow.find(".price").val()) || 0;
    let qty = parseFloat(requestedRow.find(".addEnterQty").text()) || 0;
    let vat = parseFloat(requestedRow.find(".vat").val()) || 0;

    let total = price * qty;
    let totalExclVat = total;
    let totalInclVat = total + ((total / 100) * vat);
    requestedRow.find(".totalExclVat").val(addThousandSeperator(totalExclVat.toFixed(2)));
    requestedRow.find(".totalInclVat").val(addThousandSeperator(totalInclVat.toFixed(2)));
    calculateTotalInclVATAmount();
}
var getCompanyDefaultCurrencyCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        baseCurrencyID = responseJSON.resultJSON.Value;
        loadCurrencyDropdownList('CurrencyID', baseCurrencyID);
        loadCurrencyDropdownList('BaseCurrencyID', baseCurrencyID);
        //$('#BaseCurrencyID').prop("disabled", true);
        checkCurrencyMatch();
    } else {
        errorToastr(responseJSON.Message, "error");
    }
}
function checkCurrencyMatch() {
    var currencyID = $('#CurrencyID').val();
    var baseCurrencyID = $('#BaseCurrencyID').val();
    var fcRate = $('#FCRate');

    if (currencyID === baseCurrencyID) {
        fcRate.prop('disabled', true).addClass('readonly');
        fcRate.val('1.00');
        //calculateBaseCurrencyAmount();
    } else {
        fcRate.prop('disabled', false).removeClass('readonly');
    }
}
function calculateTotalInclVATAmount() {
    let total = 0;
    $("#addToCartTable tbody tr").each(function () {
        let totalInclVat = parseFloat(removeAllCommas($(this).find(".totalInclVat").val())) || 0;
        total += totalInclVat;
    });
    $("#TotalAmount").text(addThousandSeperator(total.toFixed(2)));
}
function saveRecord(isPost = false) {
    if (customValidateForm('saveSaleInvoiceForm')) {
        let customerContctObject = {};      
        var item = getFormDataAsJSONObject('saveSaleInvoiceForm');
        item['TotalAmount'] = parseFloat(removeAllCommas($("#TotalAmount").text()));
   
            var customerName = $("#CustomerID option:selected").text();           
            ajaxRequest({ url: "/PointOfSale/PaymentMethod/GetByID", type: 'POST', data: { ID:item.PaymentMethodID }, callBack: function (responseJSON) {
                    if (responseJSON.IsSuccess) {
                        customerContctObject = {
                            CustomerID: item.CustomerID,
                            Name: customerName,
                            AccountHeadID: responseJSON.resultJSON.AccountHeadID
                        }  
                        let statusValue = isPost ? '1' : '2';
                        let saleInvoiceObject = {
                            ID: 0,
                            SaleInvoiceTypeID: item.InvoiceTypeID,
                            InvoiceNo: item.InvoiceNo,
                            CustomerNoID: item.CustomerID,
                            PostingDate: item.InvoiceDate,
                            SaleInvoiceDate: item.InvoiceDate,
                            Status: statusValue,
                            CurrencyID: item.CurrencyID,
                            BaseCurrencyID: item.BaseCurrencyID,
                            POAmount: item.TotalAmount,
                            BaseAmount: item.FCRate,
                            AmountInclTax: item.TotalAmount,
                            CurrencyAmount: item.FCRate,
                            BaseCurrencyID: item.BaseCurrencyID,
                            PrdSaleInvoiceDetail: getAddToCartInvoiceDetails()
                        }
                        let deliveryNoteObject = {
                            ID: 0,
                            SaleOrderID: 0,
                            CustomerNoID: item.CustomerID,
                            IncoTermsID: item.PaymentMethodID,
                            DeliveryNoteDate: item.InvoiceDate,
                            POAmount: item.TotalAmount,
                            StatusID: statusValue,
                            CurrencyID: item.CurrencyID,
                            CurrencyAmount: item.FCRate,
                            BaseCurrencyID: item.BaseCurrencyID,
                            DeliveryNoteID: 0,
                            DeliveryNoteTypeID: '1',
                            PrdDeliveryNoteDetail: getAddToCartNoteDetails()
                        }                        
                        let saleInvoiceItemDetailVariant = getSaleInvoiceItemDetailVariant();
                        ajaxRequest({ url: "/ProductManagement/SalesInvoice/Create", type: 'POST', data: { OBJ: saleInvoiceObject, Note: deliveryNoteObject, objvariant: saleInvoiceItemDetailVariant, invoiceType: "POS", CustomerContact: customerContctObject }, callBack: saveRecordCallBack });
                    }
                    else {
                        errorToastr(responseJSON.Message, 'error');
                    }
                }
            });           
       

    }

}
function saveRecordCallBack(responseJSON) {
    if (responseJSON.Code === 200) {
        successToastr("Sale Invoice saved", 'success');
        swal.fire({
            title: "Confirmation",
            text: 'Do you want to print this POS Receipt?',
            type: 'info',
            cancelButtonColor: '#F04249',
            showCancelButton: true,
            confirmButtonText: "Yes, Print it!",
            cancelButtonText: 'No',
            dangerMode: true,
            allowOutsideClick: false,
        }).then(
            function (isConfirm) {
                if (isConfirm.value == true) {
                    getCompanyDetailByID();
                }
                else {
                    clearFormFields();
                    //errorToastr("Your operation Canceled :)", "error");
                }
            });
    }
    else {
        errorToastr(responseJSON.Message, responseJSON.Type);

    }
}
function getAddToCartInvoiceDetails() {
    var addToCartInvoiceJSONArray = [];
    $('#addToCartTable tr').each(function (rowIndex) {
        let variantIDs = $(this).find('td.tdVariantDetailID').text().trim();
        if (rowIndex > 0) {
            var addToCartInvoiceJSONObject = {};
            addToCartInvoiceJSONObject['ID'] = 0;
            addToCartInvoiceJSONObject['SaleInvoiceID'] = 0;
            addToCartInvoiceJSONObject['UOMID'] = parseInt($(this).find('td.tdUOMID').text());
            addToCartInvoiceJSONObject['VariantID'] = parseInt($(this).find('td.tdVariantTypeID').text());
            addToCartInvoiceJSONObject['VariantDetailID'] = variantIDs.includes(',')
                ? variantIDs.split(',').map(id => parseInt(id.trim()))
                : parseInt(variantIDs);
            addToCartInvoiceJSONObject['ItemTypeID'] = parseInt($(this).find('td.tdItemTypeID').text());
            //addToCartInvoiceJSONObject['AccountHeadID'] = $(this).find('td.tdAccountHeadID').text();

            addToCartInvoiceJSONObject['Description'] = $(this).find('td.tdItemName').find('select option:selected').text();
            addToCartInvoiceJSONObject['ItemNo'] = $(this).find('td.tdItemName').find('select').val();
            addToCartInvoiceJSONObject['UnitPrice'] = parseInt(removeAllCommas($(this).find('td.tdPrice').find('input').val()));
            addToCartInvoiceJSONObject['Quantity'] = $(this).find('td.tdQuantity').text();
            addToCartInvoiceJSONObject['QtyToDeliver'] = $(this).find('td.tdQuantity').text();
            addToCartInvoiceJSONObject['QtyDelivered'] = $(this).find('td.tdQuantity').text();
            addToCartInvoiceJSONObject['LineAmount'] = parseInt(removeAllCommas($(this).find('td.tdTotalexclVat').find('input').val()));
            addToCartInvoiceJSONObject['AmountAfterDiscount'] = parseInt(removeAllCommas($(this).find('td.tdTotalexclVat').find('input').val()));
            addToCartInvoiceJSONObject['Tax'] = parseInt(removeAllCommas($(this).find('td.tdVat').find('input').val()));
            addToCartInvoiceJSONObject['AmountInclTax'] = parseInt(removeAllCommas($(this).find('td.tdTotalInclVAT').find('input').val()));
            addToCartInvoiceJSONObject['Total'] = parseInt(removeAllCommas($(this).find('td.tdTotalInclVAT').find('input').val()));
            //addToCartInvoiceJSONObject['WarehouseID'] = $(this).find('td.tdWarehouseID').find('select').val();
            addToCartInvoiceJSONObject['WarehouseID'] = parseInt($(this).find('td.tdWarehouseID').text());
            addToCartInvoiceJSONArray.push(addToCartInvoiceJSONObject);
        }
    });
    return addToCartInvoiceJSONArray;
}
function getAddToCartNoteDetails() {
    var addToCartNoteJSONArray = [];
    $('#addToCartTable tr').each(function (rowIndex) {
        let variantIDs = $(this).find('td.tdVariantDetailID').text().trim();
        if (rowIndex > 0) {
            var addToCartNoteJSONObject = {};

            addToCartNoteJSONObject['ID'] = 0;
            addToCartNoteJSONObject['DeliveryNoteID'] = 0;
            addToCartNoteJSONObject['UOMID'] = parseInt($(this).find('td.tdUOMID').text());
            addToCartNoteJSONObject['VariantTypeID'] = parseInt($(this).find('td.tdVariantTypeID').text());
            addToCartNoteJSONObject['VariantDetailID'] = variantIDs.includes(',')
                ? variantIDs.split(',').map(id => parseInt(id.trim()))
                : parseInt(variantIDs);
            addToCartNoteJSONObject['ItemTypeID'] = parseInt($(this).find('td.tdItemTypeID').text());
            //addToCartNoteJSONObject['AccountHeadID'] = $(this).find('td.tdAccountHeadID').text();  
            addToCartNoteJSONObject['Description'] = $(this).find('td.tdItemName').find('select option:selected').text();
            addToCartNoteJSONObject['ItemNoID'] = $(this).find('td.tdItemName').find('select').val();
            addToCartNoteJSONObject['UnitPrice'] = parseInt(removeAllCommas($(this).find('td.tdPrice').find('input').val()));
            addToCartNoteJSONObject['Quantity'] = $(this).find('td.tdQuantity').text();
            addToCartNoteJSONObject['QtyToDeliver'] = $(this).find('td.tdQuantity').text();
            addToCartNoteJSONObject['QtyDelivered'] = $(this).find('td.tdQuantity').text();
            addToCartNoteJSONObject['LineAmount'] = parseInt(removeAllCommas($(this).find('td.tdTotalexclVat').find('input').val()));
            addToCartNoteJSONObject['AmountAfterDiscount'] = parseInt(removeAllCommas($(this).find('td.tdTotalexclVat').find('input').val()));
            addToCartNoteJSONObject['Tax'] = parseInt(removeAllCommas($(this).find('td.tdVat').find('input').val()));
            addToCartNoteJSONObject['AmountInclTax'] = parseInt(removeAllCommas($(this).find('td.tdTotalInclVAT').find('input').val()));
            //addToCartNoteJSONObject['WarehouseID'] = $(this).find('td.tdWarehouse').find('select').val();
            addToCartNoteJSONObject['WarehouseID'] = parseInt($(this).find('td.tdWarehouseID').text());

            addToCartNoteJSONArray.push(addToCartNoteJSONObject);
        }
    });
    return addToCartNoteJSONArray;
}
function getSaleInvoiceItemDetailVariant() { 
    var saleInvoiceItemDetailVariantJSONArray = [];
    $('#addToCartTable tr').each(function (rowIndex) {
        if (rowIndex > 0) {
            var $row = $(this);

            var productID = parseInt($row.find('td.tdID').text());
            var variantID = parseInt($row.find('td.tdVariantTypeID').text());
            var quantity = $row.find('td.tdQuantity').text();
            var rate = parseInt(removeAllCommas($row.find('td.tdPrice').find('input').val()));
            var variantDetailIDsText = $row.find('td.tdVariantDetailID').text().trim();
            var variantDetailIDs = variantDetailIDsText ? variantDetailIDsText.split(',').map(id => id.trim()).join(',') : "0";

            var saleInvoiceItemDetailVariantJSONObject = {
                ID: 0,
                ProductID: productID,
                VariantID: variantID,
                AttributeID: variantDetailIDs,
                SaleInvoiceDetailID: 0,
                Quantity: quantity,
                Rate: rate
            };

            saleInvoiceItemDetailVariantJSONArray.push(saleInvoiceItemDetailVariantJSONObject);
        }
    });
    return saleInvoiceItemDetailVariantJSONArray;
}
function clearFormFields(id = 0) {

    $('#saveSaleInvoiceForm').find(':input, textarea, table').each(function () {
        $(this).val('');
        if ($(this).is('textarea')) {
            $(this).text('');
        }
        if ($(this).is('select')) {
            $(this).val(0);
            $(this).change();
        }
        if ($(this).is(':checkbox')) {
            $(this).prop('checked', false);
        }
        if ($(this).hasClass('datepicker')) {
            $(this).datepicker("setDate", null);
        }
        if ($(this).is('table')) {
            $(this).find('tbody').html('');
        }
        $('#addToCartTable tbody').html('');
        addToCartRow();
        _addToCartArray = [];
        datePickerDDMMYYYYFormat('InvoiceDate', true);
        $("#btnClearCart").hide()
    });
    getNumber();
    getCompanyDefaultCurrency();
    $('#ID').val(id);
    $('#TotalAmount').text('');
}
function getWarehousesByProduct(productID = 0, $warehouseDropdown) {
    ajaxRequest({
        url: '/RealEstate/Dropdowns/Get',
        type: 'POST',
        data: {
            Table: `BHAERPInventorySuite.dbo.WarehouseLocation WHL INNER JOIN BHAERPInventorySuite.dbo.PrdProductWarehouse PPW ON WHL.ID = PPW.WarehouseID`,
            Columns: 'WHL.ID Value, WHL.WarehouseName Text',
            Condition: `WHERE WHL.IsActive = 1
                        AND PPW.IsActive = 1
                        AND PPW.ProductItemID = ${productID}
            `
        },
        callBack: function (responseJSON) {
            let options = `<option value="0" selected>Select Warehouse</option>`;
            let selectedValue = 0;

            if (responseJSON.resultJSON.length > 0) {
                const warehouses = responseJSON.resultJSON;

                if (warehouses.length === 1) {
                    selectedValue = warehouses[0].Value;
                }
                $.each(warehouses, function (index, item) {
                    const selected = item.Value == selectedValue ? "selected" : "";
                    options += `<option value="${item.Value}" ${selected}>${item.Text}</option>`;
                });
            }
            $warehouseDropdown.html(options).trigger('change');
        }

    });
}
function getCompanyDetailByID() {
    ajaxRequest({
        url: '/CoreSuite/GetCompanyDetails', type: 'POST', data: {}, callBack: function (responseJSON) {
            if (responseJSON.IsSuccess && responseJSON.resultJSON != null) {
                openPOSReceipt(responseJSON.resultJSON);
                clearFormFields();
            }
        }
    });
}
function openPOSReceipt(responseJSON) {
    const companyName = responseJSON.Description;
    const streetAddress = responseJSON.StreetAddress;
    const stateAndCity = `${responseJSON.State}, ${responseJSON.City}`;

    const date = new Intl.DateTimeFormat('en-GB').format(new Date()).replace(/\//g, '-');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const invoiceNo = $('#InvoiceNo').val();
    const cashierName = $('#CustomerID option:selected').text().split(' - ')[1];

    const items = [];
    $('#addToCartTable tr').each(function (rowIndex) {
        if (rowIndex > 0) {
            var saleInvoiceItemDetailJSONObject = {};

            saleInvoiceItemDetailJSONObject['description'] = $(this).find('td.tdItemName').find('select option:selected').text();
            saleInvoiceItemDetailJSONObject['price'] = parseFloat(removeAllCommas($(this).find('td.tdTotalInclVAT').find('input').val())) || 0;
            items.push(saleInvoiceItemDetailJSONObject);
        }
    });

    const total = items.reduce((sum, item) => sum + item.price, 0);

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body {
                    width: 80mm;
                    margin: 0 auto;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    color: #000;
                    background: #fff;
                }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .right { text-align: right; }
                .line {
                    border-top: 1px dashed #000;
                    margin: 5px 0;
                }
                .header-table {
                    width: 100%;
                    font-size: 12px;
                    margin-top: 8px;
                }
                .header-table td {
                    vertical-align: top;
                    padding: 2px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 5px;
                }
                td {
                    padding: 4px 0;
                }
                .desc { width: 70%; }
                .price { width: 30%; text-align: right; }
                @media print {
                    body { width: 80mm; margin: 0; }
                }
            </style>
        </head>
        <body>

            <!-- ===== HEADER SECTION ===== -->
            <div class="center bold" style="margin-top:10px;">${companyName}</div>
            <div class="center">${streetAddress}</div>
            <div class="center">${stateAndCity}</div>

            <table class="header-table">
                <tr>
                    <td>${date}</td>
                    <td class="right">${time}</td>
                </tr>
                <tr>
                    <td>${invoiceNo}</td>
                    <td class="right">${cashierName}</td>
                </tr>
            </table>
     
            <div class="line"></div>        
            <table>
                <thead>
                    <tr class="bold">
                        <td>Description</td>
                        <td class="right">Price</td>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td class="right">$${item.price.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="line"></div>

            <table>              
                <tr>
                    <td class="bold">TOTAL</td>
                    <td class="right bold">$${total.toFixed(2)}</td>
                </tr>
            </table>

            <div class="center bold" style="margin-top:8px;">THANK YOU</div>
             <div class="line"></div>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() { window.close(); };
                };
            </script>
        </body>
        </html>
    `);

    printWindow.document.close();
}

function addNewCustomer() {
    $('#CustomerModal').modal('show');
    $("span:contains('This field is required')").hide();
    $('.selector_2').val(0);
    $("select.ddlCountry,select.ddlBranch,select.ddlControlAccount").select2({
        width: "100%",
        //placeholder: "Select an option",
        minimumResultsForSearch: 0,
        dropdownParent: $('#CustomerModal')

    });
    $(".mutiple_sel").select2({ width: "style" });
    getCustomerNumber();
    let inputFieldsAndSelectedValue = [
        { inputIdAttr: 'ControlAccountID', selectedValue: 0, defaulText: null },

    ];
    loadAccountHeadsDropdownList(inputFieldsAndSelectedValue);
    loadCountryDropdownlist('CountryID', 0);
    loadCompanyBranchesDropdownList('BranchID', 0);
}

function loadInvoicesTableData() {
    ajaxRequest({ url: "/PointOfSale/ProductSearch/InvoiceGetAll", type: 'POST', data: {}, callBack: loadInvoicesTableDataCallBack });
}
var loadInvoicesTableDataCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        invoicesList = responseJSON.resultJSON || [];
        generateHTMLTableRowsFromJSON(responseJSON.resultJSON, 'InvoicesTable', null, null, null, null, ['Amount']);
        currentInvoiceIndex = 0;
        highlightSelectedInvoiceRow();
    }
    else {
        errorToastr(responseJSON.message, "error");
    }
}

function highlightSelectedInvoiceRow() {
    if (!invoicesList.length) return;

    $('#InvoicesTable tbody tr td').css({ background: '', color: '' });

    let row = $("#InvoicesTable tbody tr").eq(currentInvoiceIndex);
    row.find('td').css({ background: '#07A6B1', color: '#fff' });
    let container = $('.bha-scroll');
    if (row.length) {

        let rowTop = row.offset().top;

        let containerTop = container.offset().top;

        let scrollTop = container.scrollTop();

        let offset = rowTop - containerTop + scrollTop;

        let scrollTo = offset - container.height() / 2 + row.outerHeight() / 2;

        container.stop().animate({
            scrollTop: scrollTo
        }, 700, 'swing');
    }    
    let selectedInvoice = invoicesList[currentInvoiceIndex];
    if (selectedInvoice && selectedInvoice.ID) {
        loadInvoiceDetailGetByID(selectedInvoice.ID);
    }
}
function loadInvoiceDetailGetByID(invoiceID) {
    ajaxRequest({ url: "/PointOfSale/ProductSearch/InvoiceDetailGetByID", type: 'POST', data: { ID: invoiceID }, callBack: loadInvoiceDetailCallBack });
}
var loadInvoiceDetailCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        generateHTMLTableRowsFromJSON(responseJSON.resultJSON, 'InvoiceDetailTable', null, null, null, null, ['AmountAfterDiscount', 'Tax', 'AmountInclTax']);
    }
    else {
        errorToastr(responseJSON.message, "error");
    }
}
//Add & Search Product Js
$("#addGlobalSearch").on("keyup", function () {
    const text = $(this).val().toLowerCase().trim();
    if (text.length < 2) {
        $("#addGlobalSearchPanel").addClass("d-none");
        return;
    }
    $("#addGlobalSearchPanel").removeClass("d-none");
    //loadMoreClickCount = 1;
    filteredArray = _allProductsArray.filter(obj => Object.values(obj).map(v => v ? v.toString().toLowerCase() : "").join(" ").includes(text)
    );
    //const filteredArray = _filteredProductItemsArray.slice(0, 8);
    renderaddToCartGlobalSearch(filteredArray);
});
function renderaddToCartGlobalSearch(filteredArray) {

    let html = `<div class="row">
          <div class="invoice-col-left">
          <div class="section-title">Favorites</div>`;

    // Suggestions → only favorites
    filteredArray.filter(p => p.IsFavorite).forEach(s => {
        html += `<div class="suggestion-pill" style="color:#007E87;" onclick="filterByProductaddToCartRow(${s.ID});">
                    ${s.ItemName}
                 </div>`;
    });

    html += `<br><br>
         <div class="section-title">SUGGESTED PRODUCTS</div>
         <div class="product-grid">`;

    // Product cards
    filteredArray.forEach(p => {
        html += `
               <div class="product-card" onclick="filterByProductaddToCartRow(${p.ID});">
                   <img src="${p.LogoUrl}" alt="${p.ItemName}">
                   <div class="product-info">
                       <div class="name">${p.ItemName}</div>
                       <div class="sku">NO:<span style="color:#007E87;"> ${p.ItemNo}</span></div>
                   </div>
               </div>`;
    });

    html += `</div></div>
        </div>`; 

    $("#addGlobalSearchPanel").html(html);
}
function loadMoreddToCartClick() {
    let nextCount = loadMoreClickCount * 8;
    const loadMoreArray = _filteredProductItemsArray.slice(((loadMoreClickCount - 1) * 8), nextCount);
    renderaddToCartGlobalSearch(loadMoreArray);

    if (nextCount <= _filteredProductItemsArray.length) {
        loadMoreClickCount++;
    } else {
        loadMoreClickCount = 1;
    }
}
function filterByProductaddToCartRow(productID = 0) {      
    let productaddToCartArray = _allProductsArray.find(row => row.ID === productID);
    let $tbody = $("#addToCartTable tbody");
    let $existingRow = $tbody.find("tr").filter(function () {
        let idText = $(this).find(".tdID").text().trim();
        return idText !== "" && idText == productID;
    });

    if ($existingRow.length > 0) {
        infoToastr(`Product "${productaddToCartArray.ItemName}" already exists in cart`, "Info");
    } else {

        if ($tbody.find("tr").length === 1 && $tbody.find(".tdID").text().trim() === "0") {
            $tbody.empty();
        }

        addToCartRow(productaddToCartArray);
        $("#addGlobalSearchPanel").addClass("d-none");
    }  
   
}