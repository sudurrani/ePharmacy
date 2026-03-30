$(document).ready(function () {    
     $('#btnRefundSecurityDepositModal').click(function () {
        var description = "", propertyName = [],unitNo = null;;

        if ($('#LeaseAgreementID').val() == null || $('#LeaseAgreementID').val() == 0) {
            infoToastr("Please select an agreement first", 'info');
            return;
        } else {
            $('#PropertyUnitsDetailTable tbody tr').each(function () {
                var prop = $(this).find('td.tdProperty').text();
                var unit = $(this).find('td.tdUnitNo').text();

                if (!propertyName.includes(prop)) {
                    propertyName.push(prop);
                }               
                unitNo = unitNo == null ? $(this).find('td.tdUnitNo').text() : (unitNo + ', ' + $(this).find('td.tdUnitNo').text());
            });
            var leaseAgreement;
            if ($('#LeaseAgreementID').is('select') > 0) {                
                leaseAgreement = $('#LeaseAgreementID option:selected').text()
            } else {
                leaseAgreement = $('#AgreementNo').val();
            }
          
            //var leaseAgreement = ($('#LeaseAgreementID').val() > 0) ? $('#LeaseAgreementID option:selected').text() : ($('#AgreementNo').val() ? $('#AgreementNo').val():'No data');
            description += "Property(s): " + propertyName.join(', ') + ", Unit No(s): " + unitNo + ", Agreement: " + leaseAgreement;

            $('#BRVModal').modal('show');
            let securityDeposit = $('#SecurityDeposit').val();
            $("#BRVtxtPaymentAmount").val(securityDeposit);            
            $("#BRVtxtBenificaryAmount").val(securityDeposit);            
            $('#BRVtxtTitle').val(description);
        }
    });


    
});



