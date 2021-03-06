
$(document).ready(function (e) {

	__removeItem('slpayment_status');	
    
	var $customer = $('#slcustomer');
    $customer.change(function (e) {
        __setItem('slcustomer', $(this).val());
    });
	
    if (slcustomer = __getItem('slcustomer')) {
        $customer.val(slcustomer).select2({
            minimumInputLength: 1,
            data: [],
            initSelection: function (element, callback) {
                $.ajax({
                    type: "get", async: false,
                    url: site.base_url+"customers/getCustomer/" + $(element).val(),
                    dataType: "json",
                    success: function (data) {
                        callback(data[0]);
                    }
                });
            },
            ajax: {
                url: site.base_url + "customers/suggestions",
                dataType: 'json',
                quietMillis: 15,
                data: function (term, page) {
                    return {
                        term: term,
                        limit: 10
                    };
                },
                results: function (data, page) {
                    if (data.results != null) {
                        return {results: data.results};
                    } else {
                        return {results: [{id: '', text: 'No Match Found'}]};
                    }
                }
            }
        });
    } else {
        nsCustomer();
    }
	
	/*
    if (slcustomer = __getItem('slcustomer')) {
        $customer.val(slcustomer).select2({
            minimumInputLength: 1,
            data: [],
            initSelection: function (element, callback) {
                $.ajax({
                    type: "get", async: false,
                    url: site.base_url+"customers/getCustomer/" + $(element).val(),
                    dataType: "json",
                    success: function (data) {
                        callback(data[0]);
                    }
                });
            },
            ajax: {
                url: site.base_url + "customers/suggestions",
                dataType: 'json',
                quietMillis: 15,
                data: function (term, page) {
                    return {
                        term: term,
                        limit: 10
                    };
                },
                results: function (data, page) {
                    if (data.results != null) { 
                        return {results: data.results};
                    } else {
                        return {results: [{id: '', text: 'No Match Found'}]};
                    }
                }
            }
        });
    } else {
        nsCustomer();
    }
	*/
	
	

// Order level shipping and discount localStorage


$('#delivery_by').change(function (e) {
	__setItem('delivery_by', $(this).val());
});

if (delivery_by = __getItem('delivery_by')) {
	$('#delivery_by').val(delivery_by);
}

if (sldiscount = __getItem('sldiscount')) {
	$('#sldiscount').val(sldiscount);
}
$('#sltax2').change(function (e) {
	__setItem('sltax2', $(this).val());
    $('#sltax2').val($(this).val());
});
if (sltax2 = __getItem('sltax2')) {
	$('#sltax2').select2("val", sltax2);
}
if (delivery_by = __getItem('delivery_by')) {
	$('#delivery_by').select2("val", delivery_by);
}
$('#slsale_status').change(function (e) {
	__setItem('slsale_status', $(this).val());
});
if (slsale_status = __getItem('slsale_status')) {
	$('#slsale_status').select2("val", slsale_status);
}
$('#slpayment_status').change(function (e) {
	var ps = $(this).val();
	__setItem('slpayment_status', ps);
	if (ps == 'partial' || ps == 'paid') {
		$('.paid_by').val('deposit');
		if(ps == 'paid') {
			//$('#amount_1').val(formatDecimal(parseFloat(((total + invoice_tax) - order_discount) + shipping)));
			//$('#total_balance_1').val(formatDecimal(parseFloat(((total + invoice_tax) - order_discount) + shipping)));
		}
		
		$('#payments').slideDown();
		$('#pcc_no_1').focus();
		$('#paid_by_1').trigger('change');
		
	} else {
		$('#amount_1').val('');
		$('#payments').slideUp();
	}
});
if (slpayment_status = __getItem('slpayment_status')) {
	$('#slpayment_status').select2("val", slpayment_status);
	var ps = slpayment_status;
	if (ps == 'partial' || ps == 'paid') {
		$('#payments').slideDown();
		$('#pcc_no_1').focus();
	} else {
		$('#payments').slideUp();
	}
}

/*==========================================chin local updated========================================*/
$(document).on('keyup', '#amount_1', function () {
	
	var us_paid = $('#amount_1').val()-0;
	var old_amount = $('#gtotal').text()-0;
	var tmp_deposit_amount = $(".deposit_total_amount").text().split('$');
	var deposit_amount = Number(tmp_deposit_amount[1].replace(/[^0-9\.]+/g,""));
	var deposit_balance = parseFloat($('#amount_1').attr('old_balance'));
	var balance = 0;
	var amount = 0;
	
	if(old_amount < deposit_balance) {
		balance = old_amount;
	}else {
		balance = deposit_balance;
	}
	if(Number(us_paid) > 0) {
		amount = us_paid;
	}else {
		amount = 0;
		$("#amount_1").val('');
		$("#amount_1").select();
	}
	if(amount <= balance) {
		var new_balance = deposit_balance - amount;
		$('.deposit_avaliable_balance').text(formatMoney(new_balance,'$'));
	}else {
		var new_balance = deposit_balance - balance;
		$("#amount_1").val(formatMoney(balance));
		$('.deposit_avaliable_balance').text(formatMoney(new_balance,'$'));
		$("#amount_1").select();
	}
});
/*====================================chin local updated=========================================*/
$(document).on('change', '#paid_by_1', function(){
	if($(this) == 'deposit'){
		checkDeposit();
		$('#amount_1').trigger('change');
	}
	
});

$(document).on('load', function(){
	$(".paid_by").trigger('change');
});
/*================================================chin local updated===========================================*/
function checkDeposit() {
	var customer_id = $("#slcustomer2").val();
	//var customer_id = $("#customer1").val();
	if (customer_id != '') {
		$.ajax({
			type: "get", async: false,
			url: site.base_url + "sales/validate_deposit/" + customer_id,
			dataType: "json",
			success: function (data) {
				//alert(JSON.stringify(data));
				if (data === false) {
					$('#deposit_no_1').parent('.form-group').addClass('has-error');
					$("#amount_1").prop('disabled', true);
					bootbox.alert('Invalid Customer');
				} else if (data.id !== null && data.id !== customer_id) {
					$('#deposit_no_1').parent('.form-group').addClass('has-error');
					$("#amount_1").prop('disabled', true);
					bootbox.alert('This Customer Has No Deposit');
				} else {
					var deposit_amount =  data.deposit_amount;
					var dep_amount = data.dep_amount;
					var paid = Number(__getItem('paid'));
					var tmp_deposit = data.tmp_deposit - paid;
					var deposit_balance = data.balance;
					var amount = parseFloat(((total + invoice_tax) - order_discount) + shipping);
					var payment_status = __getItem('slpayment_status');
					var avaliable_balance = dep_amount - tmp_deposit;
					
					if(avaliable_balance < deposit_balance) {
						var new_aval_balance = avaliable_balance;
					}else {
						var new_aval_balance = deposit_balance;
					}
					if(payment_status == "paid"){
						if(new_aval_balance<amount){
							$("#amount_1").val(new_aval_balance);
							$("#amount_1").attr('old_amount', amount);
							$("#amount_1").attr('old_balance', new_aval_balance);	
						}else{
							$("#amount_1").val(amount);
							$("#amount_1").attr('old_amount', amount);
							$("#amount_1").attr('old_balance', new_aval_balance);
						}
						
						$('#dp_details').html('<small>Customer Name: ' + data.company + '<br>Amount: <span class="deposit_total_amount">' + formatMoney(dep_amount,'$') + '</span> - Actual Balance: <span class="deposit_total_balance">' + formatMoney(deposit_balance,'$') + '</span> - Avaliable Balance: <span class="deposit_avaliable_balance">' + formatMoney(new_aval_balance,'$') + '</span></small>');
						$('#deposit_no').parent('.form-group').removeClass('has-error');
					}else if(payment_status =="partial"){
						if(new_aval_balance<amount){
							$("#amount_1").val(paid);
							$("#amount_1").attr('old_amount', amount);
							$("#amount_1").attr('old_balance', new_aval_balance);	
						}else{
							$("#amount_1").val(paid);
							$("#amount_1").attr('old_amount', amount);
							$("#amount_1").attr('old_balance', new_aval_balance);
						}
						
						$('#dp_details').html('<small>Customer Name: ' + data.company + '<br>Amount: <span class="deposit_total_amount">' + formatMoney(dep_amount,'$') + '</span> - Actual Balance: <span class="deposit_total_balance">' + formatMoney(deposit_balance,'$') + '</span> - Avaliable Balance: <span class="deposit_avaliable_balance">' + formatMoney(new_aval_balance,'$') + '</span></small>');
						$('#deposit_no').parent('.form-group').removeClass('has-error');
					}
					
				}
			}
		});
	}
}
/*==============================================================end local updated==========================================*/
$(document).on('change', '.paid_by', function () {
	var p_val = $(this).val();
	__setItem('paid_by', p_val);
	$('#rpaidby').val(p_val);
	if (p_val == 'cash' ||  p_val == 'other') {
		$('.pcheque_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').hide();
		$('.pcash_1').show();
		$('#payment_note_1').focus();
	} else if (p_val == 'CC') {
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcc_1').show();
		$('#pcc_no_1').focus();
	} else if (p_val == 'Cheque') {
		$('.pcc_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcheque_1').show();
		$('#cheque_no_1').focus();
	} else if (p_val == 'depreciation') {
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').show();
		$('#rate_1').focus();
	} else {
		$('.pcheque_1').hide();
		$('.depreciation_1').hide();
		$('.pcc_1').hide();
		$('.pcash_1').hide();
	}
	if (p_val == 'gift_card') {
		$('.gc').show();
		$('.ngc').hide();
		$('#gift_card_no').focus();
	} else {
		$('.ngc').show();
		$('.gc').hide();
		$('#gc_details').html('');
	}
	if(p_val == 'deposit') {
		$('.dp').show();
		$('#slcustomer2').trigger('change');
		checkDeposit();
	}else{
		$('.dp').hide();
		$('#dp_details').html('');
	}
}).trigger('change');

if (paid_by = __getItem('paid_by')) {
	var p_val = paid_by;
	$('.paid_by').select2("val", paid_by);
	$('#rpaidby').val(p_val);
	if (p_val == 'cash' ||  p_val == 'other') {
		$('.pcheque_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').hide();
		$('.pcash_1').show();
		$('#payment_note_1').focus();
	} else if (p_val == 'CC') {
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcc_1').show();
		$('#pcc_no_1').focus();
	} else if (p_val == 'Cheque') {
		$('.pcc_1').hide();
		$('.pcash_1').hide();
		$('.depreciation_1').hide();
		$('.pcheque_1').show();
		$('#cheque_no_1').focus();
	} else if (p_val == 'depreciation'){
		$('.pcheque_1').hide();
		$('.pcash_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').show();
		$('#rate_1').focus();
	} else {
		$('.pcheque_1').hide();
		$('.pcc_1').hide();
		$('.depreciation_1').hide();
		$('.pcash_1').hide();
	}
	if (p_val == 'gift_card') {
		$('.gc').show();
		$('.ngc').hide();
		$('#gift_card_no').focus();
	} else {
		$('.ngc').show();
		$('.gc').hide();
		$('#gc_details').html('');
	}
}

$(document).on('click', '#add_sale', function(){
	var us_paid = $('#amount_1').val()-0;
	var deposit_amount = parseFloat($(".deposit_total_amount").text());
	var deposit_balance = parseFloat($(".deposit_total_balance").text());
	deposit_balance = formatDecimal(deposit_amount - Math.abs(us_paid));
	$(".deposit_total_balance").text(deposit_balance);

	if(deposit_balance > deposit_amount || deposit_balance < 0 || deposit_amount == 0){
		bootbox.alert('Your Deposit Limited: ' + deposit_amount);
		$('#amount_1').val(deposit_amount);
		$(".deposit_total_balance").text(deposit_amount - $('#amount_1').val()-0);
		return false;
	}
});

//==============================loan add by chin=========================
$(document).on('change','#depreciation_type_1, #depreciation_rate_1, #depreciation_term_1',function() {
	var p_type = $('#depreciation_type_1').val();
	var rate = $('#depreciation_rate_1').val()-0;
	var term = $('#depreciation_term_1').val()-0;
	var total_amount = $('#total_balance').val()-0;
	var us_down = $('#amount_1').val()-0;
	var down_pay = us_down;
	var loan_amount = total_amount - down_pay;
	depreciation(loan_amount,rate,term,p_type,total_amount);
});

function depreciation(amount,rate,term,p_type,total_amount){
	var dateline = '';
	var d = new Date();
	if(p_type == ''){
		$('#print_').hide();
		return false;
	}else{
		$('#print_').show();
		if(rate == '' || rate < 0) {
			if(term == '' || term <= 0) {
				$('.dep_tbl').hide();
				alert("Please choose Rate and Term again!");
				return false;
			}else{
				$('.dep_tbl').hide();
				alert("Please choose Rate again!"); 
				return false;
			}
		}else{
			if(term == '' || term <= 0) {
				$('.dep_tbl').hide();
				alert("Please choose Term again!"); 
				return false;
			}else{
				var tr = '';
				if(p_type == 1 || p_type == 3){
					tr += '<tr>';
					tr += '<th> Pmt No. </th>';
					tr += '<th> Interest </th>';
					tr += '<th> Principal </th>';
					tr += '<th> Total Payment </th>';
					tr += '<th> Balance </th>';
					tr += '<th> Note </th>';
					tr += '<th> Payment Date </th>';
					tr += '</tr>';
				}else if(p_type == 2){
					tr += '<tr>';
					tr += '<th> PERIOD </th>';
					tr += '<th> RATE </th>';
					tr += '<th> PERCENTAGE </th>';
					tr += '<th> PYMENT </th>';
					tr += '<th> TOTAL PAYMENT </th>';
					tr += '<th> BALANCE </th>';
					tr += '<th> NOTE </th>';
					tr += '<th> DATELINE </th>';
					tr += '</tr>';
				}
				if(p_type == 1){
					var principle = amount/term;
					var interest = 0;
					var balance = amount;
					var payment = 0;
					var i=0;
					var k=1;
					var total_principle = 0;
					var total_payment = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							interest = amount*((rate/term)/100);
							dateline = $('.current_date').val();
						}else{
							interest = balance *((rate/term)/100);
							dateline = moment().add((k-1),'months').calendar();
						}
						balance -= principle;
						if(balance <= 0){
							balance = 0;
						}
						payment = principle + interest;
						tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
						tr += '<td>'+ formatDecimal(interest) +'<input type="hidden" name="interest[]" id="interest" class="interest" width="90%" value="'+ formatDecimal(interest) +'"/></td>';
						tr += '<td>'+ formatDecimal(principle) +'<input type="hidden" name="principle[]" id="principle" class="principle" width="90%" value="'+ formatDecimal(principle) +'"/></td>';
						tr += '<td>'+ formatDecimal(payment) +'<input type="hidden" name="payment_amt[]" id="payment_amt" class="payment_amt" width="90%" value="'+ formatDecimal(payment) +'"/></td>';
						tr += '<td>'+ formatDecimal(balance) +'<input type="hidden" name="balance[]" id="balance" class="balance" width="90%" value="'+ formatDecimal(balance) +'"/></td>';
						tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
						tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /> </td> </tr>';
						total_principle += principle;
						total_payment += payment;
						k++;
					}
					tr += '<tr> <td colspan="2"> Total </td>';
					tr += '<td>'+ formatDecimal(total_principle) +'</td>';
					tr += '<td>'+ formatDecimal(total_payment) +'</td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				}else if(p_type == 2) {
					var k = 1;
					var inte_rate = amount * ((rate/term)/100);
					var payment = 0;
					var amount_payment = 0;
					var balance = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							dateline = $('.current_date').val();
							amount_payment = inte_rate + payment;
							balance = amount;
							tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
							tr += '<td><input type="text" name="rate[]" id="rate" class="rate" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/><input type="hidden" name="rate_[]" id="rate_" class="rate_" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/></td>';
							tr += '<td><input type="text" name="percentage[]" id="percentage" class="percentage" style="width:60px;" value=""/><input type="hidden" name="percentage_[]" id="percentage_" class="percentage_" style="width:60px;" value=""/></td>';
							tr += '<td><input type="text" name="payment_amt[]" id="payment_amt" class="payment_amt" style="width:60px;" value="" /><input type="hidden" name="payment_amt_[]" id="payment_" class="payment_" style="width:60px;" value="" /></td>';
							tr += '<td><input type="text" name="total_payment[]" id="total_payment" class="total_payment" style="width:60px;" value="'+ formatDecimal(amount_payment) +'" readonly/><input type="hidden" name="total_payment_[]" id="total_payment_" class="total_payment_" style="width:60px;" value="'+ formatDecimal(amount_payment) +'" /></td>';
							tr += '<td><input type="text" name="balance[]" id="balance" class="balance" style="width:60px;" value="'+ balance +'" readonly/><input type="hidden" name="balance_[]" id="balance_" class="balance_" style="width:60px;" value="'+ formatDecimal(balance) +'"/></td>';
							tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
							tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /></td> </tr>';
						}else{
							dateline = moment().add((k-1),'months').calendar();
							inte_rate = balance * ((rate/term)/100);
							tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
							tr += '<td><input type="text" name="rate[]" id="rate" class="rate" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/><input type="hidden" name="rate_[]" id="rate_" class="rate_" style="width:60px;" value=""/></td>';
							tr += '<td><input type="text" name="percentage[]" id="percentage" class="percentage" style="width:60px;" value=""/><input type="hidden" name="percentage_[]" id="percentage_" class="percentage_" style="width:60px;" value="'+ formatDecimal(inte_rate) +'"/></td>';
							tr += '<td><input type="text" name="payment_amt[]" id="payment_amt" class="payment_amt" style="width:60px;" value="" /><input type="hidden" name="payment_[]" id="payment_" class="payment_" style="width:60px;" value="" /></td>';
							tr += '<td><input type="text" name="total_payment[]" id="total_payment" class="total_payment" style="width:60px;" value="" readonly/><input type="hidden" name="total_payment_[]" id="total_payment_" class="total_payment_" style="width:60px;" value="" /></td>';
							tr += '<td><input type="text" name="balance[]" id="balance" class="balance" style="width:60px;" value="" readonly/><input type="hidden" name="balance_[]" id="balance_" class="balance_" style="width:60px;" value=""/></td>';
							tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/> </td>';
							tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /></td> </tr>';
						}
						k++;
					}
					tr += '<tr> <td colspan="2"> Total </td>';
					tr += '<td><input type="text" name="total_percen" id="total_percen" class="total_percen" style="width:60px;" value="" readonly/></td>';
					tr += '<td><input type="text" name="total_pay" id="total_pay" class="total_pay" style="width:60px;" value="" readonly/></td>';
					tr += '<td><input type="text" name="total_amount" id="total_amount" class="total_amount" style="width:60px;" value="" readonly/></td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				}else if(p_type == 3) {
					var principle = 0;
					var interest = 0;
					var balance = amount;
					var rate_amount = ((rate/100)/12);
					var payment = ((amount * rate_amount)*((Math.pow((1+rate_amount),term))/(Math.pow((1+rate_amount),term)-1)));
					var i=0;
					var k=1;
					var total_principle = 0;
					var total_payment = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							interest = amount*((rate/100)/12);
							dateline = $('.current_date').val();
						}else{
							interest = balance *((rate/100)/12);
							dateline = moment().add((k-1),'months').calendar();
						}
						principle = payment - interest;
						balance -= principle;
						if(balance <= 0){
							balance = 0;
						}
						tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
						tr += '<td>'+ formatDecimal(interest) +'<input type="hidden" name="interest[]" id="interest" class="interest" width="90%" value="'+ formatDecimal(interest) +'"/></td>';
						tr += '<td>'+ formatDecimal(principle) +'<input type="hidden" name="principle[]" id="principle" class="principle" width="90%" value="'+ principle +'"/></td>';
						tr += '<td>'+ formatDecimal(payment) +'<input type="hidden" name="payment_amt[]" id="payment_amt" class="payment_amt" width="90%" value="'+ formatDecimal(payment) +'"/></td>';								
						tr += '<td>'+ formatDecimal(balance) +'<input type="hidden" name="balance[]" id="balance" class="balance" width="90%" value="'+ formatDecimal(balance) +'"/></td>';
						tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
						tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /></td> </tr>';
						total_principle += principle;
						total_payment += payment;
						k++;
					}
					tr += '<tr> <td colspan="2"> Total </td>';
					tr += '<td>'+ formatDecimal(total_principle) +'</td>';
					tr += '<td>'+ formatDecimal(total_payment) +'</td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				} else if(p_type == 4){
					var principle = amount/term;
					var interest = (amount * (rate/100))/12;
					var balance = amount;
					var payment = 0;
					var i=0;
					var k=1;
					var total_principle = 0;
					var total_payment = 0;
					for(i=0;i<term;i++){
						if(i== 0){
							dateline = $('.current_date').val();
						}else{
							dateline = moment().add((k-1),'months').calendar();
						}
						payment = principle + interest;
						
						balance -= principle;
						if(balance <= 0){
							balance = 0;
						}
						tr += '<tr> <td>'+ k +'<input type="hidden" name="no[]" id="no" class="no" value="'+ k +'" /></td> ';
						tr += '<td>'+ formatDecimal(interest) +'<input type="hidden" name="interest[]" id="interest" class="interest" width="90%" value="'+ interest +'"/></td>';
						tr += '<td>'+ formatDecimal(principle) +'<input type="hidden" name="principle[]" id="principle" class="principle" width="90%" value="'+ principle +'"/></td>';
						tr += '<td>'+ formatDecimal(payment) +'<input type="hidden" name="payment_amt[]" id="payment_amt" class="payment_amt" width="90%" value="'+ payment +'"/></td>';
						tr += '<td>'+ formatDecimal(balance) +'<input type="hidden" name="balance[]" id="balance" class="balance" width="90%" value="'+ balance +'"/></td>';
						tr += '<td> <input name="note_1[]" class="note_1 form-control" id="'+i+'" ></input> <input type="hidden" name="note1[]" id="note1" class="note1_'+i+'" width="90%"/></td>';
						tr += '<td>'+ dateline +'<input type="hidden" class="dateline" name="dateline[]" id="dateline" value="'+ dateline +'" /> </td> </tr>';
						total_principle += principle;
						total_payment += payment;
						k++;
					}
					tr += '<tr> <td colspan="2"> <?= lang("total"); ?> </td>';
					tr += '<td>'+ formatDecimal(total_principle) +'</td>';
					tr += '<td>'+ formatDecimal(total_payment) +'</td>';
					tr += '<td colspan="3"> &nbsp; </td> </tr>';
				}
				$('.dep_tbl').show();
				$('#tbl_dep').html(tr);
				//$('#tbl_dep1').html(tr);
				$("#loan1").html(tr);
			}
		}
	}
}
$("#depreciation_rate_1").on('change', function(){
	$("#loan_rate").val($(this).val());
});

$("#depreciation_type_1").on('change', function(){
	$("#loan_type").val($(this).val());
});

$("#depreciation_term_1").on('change', function(){
	$("#loan_term").val($(this).val());
});

$("#tbl_dep .note").live('change', function(){
	var id = ($(this).attr('id'));
	var value = $(this).val();
	
	$('.note1_'+id+'').val(value);
});

$(document).on('keyup', '#tbl_dep .percentage', function () {
	var rate_all = $('#depreciation_rate_1').val()-0;
	var amount = 0;
	var payment = 0;
	var amount_payment = 0;
	var rate = 0;
	var balance = 0;
	var per = $(this).val()-0;
	var tr = $(this).parent().parent();
	if(per < 0 || per > 100) {
		alert("sorry you can not input the rate value less than zerro or bigger than 100");
		$(this).val('');
		$(this).focus();
		return false;
	}else {
		amount = tr.find('.balance_').val()-0;
		rate = tr.find('.rate_').val()-0;
		payment = amount *(per/100);
		amount_payment = rate + payment;
		balance = amount - payment;
		tr.find('.payment_amt').val(formatDecimal(payment));
		tr.find('.payment_').val(formatDecimal(payment));
		tr.find('.total_payment').val(formatDecimal(amount_payment));
		tr.find('.total_payment_').val(formatDecimal(amount_payment));
		tr.find('.balance').val(formatDecimal(balance));
		tr.find('.balance_').val(formatDecimal(balance));
		
		var total_percent = 0;
		$('#tbl_dep .percentage').each(function(){
			var parent_ = $(this).parent().parent();
			var per_tage_ = parent_.find('.percentage').val()-0;
			total_percent += per_tage_;
		});
		
		var j = 1;
		var i = 1;
		var balance = 0;
		var amount_percent = 0;
		var amount_pay = 0;
		var amount_total_payment = 0;
		$('#tbl_dep .percentage').each(function(){
			var parent = $(this).parent().parent();
			var per_tage = parent.find('.percentage').val()-0;
			if(per_tage == '' || per_tage == 0) {
				per_tage = 0;
			}
			amount_percent += per_tage;
			var rate = parent.find('.rate').val()-0;
			if(j == 1) {
				var total_amount = $('#total_balance').val()-0;
				var us_down = $('#amount_1').val();
				var down_pay = us_down;
				var loan_amount = total_amount - down_pay;
				balance = loan_amount;
			}else {
				balance = parent.prev().find('.balance_').val()-0;
			}
			var new_rate = balance * (rate_all/100);
			var payment = balance * (per_tage/100);
			amount_pay += payment;
			var total_payment = payment + new_rate;
			amount_total_payment += total_payment;
			var balance = balance - payment;
			
			//alert(total_percent +" | "+ amount_percent);
			//alert(new_rate +" | "+ payment +" | "+ total_payment +" | "+ balance);
			
			if(total_percent != amount_percent) {
				parent.find('.rate').val(formatDecimal(new_rate));
				parent.find('.rate_').val(formatDecimal(new_rate));
				parent.find('.payment_amt').val(formatDecimal(payment));
				parent.find('.payment_').val(formatDecimal(payment));
				parent.find('.total_payment').val(formatDecimal(total_payment));
				parent.find('.total_payment_').val(formatDecimal(total_payment));
				parent.find('.balance').val(formatDecimal(balance));
				parent.find('.balance_').val(formatDecimal(balance));
			}else{
				if(i == 1) {
					parent.find('.rate').val(formatDecimal(new_rate));
					parent.find('.rate_').val(formatDecimal(new_rate));
					parent.find('.payment_amt').val(formatDecimal(payment));
					parent.find('.payment_').val(formatDecimal(payment));
					parent.find('.total_payment').val(formatDecimal(total_payment));
					parent.find('.total_payment_').val(formatDecimal(total_payment));
					parent.find('.balance').val(formatDecimal(balance));
					parent.find('.balance_').val(formatDecimal(balance));
				}else {
					parent.find('.rate').val(formatDecimal(new_rate));
					parent.find('.rate_').val(formatDecimal(new_rate));
					parent.find('.payment_amt').val("");
					parent.find('.payment_').val(formatDecimal(payment));
					parent.find('.total_payment').val("");
					parent.find('.total_payment_').val(formatDecimal(total_payment));
					parent.find('.balance').val("");
					parent.find('.balance_').val(formatDecimal(balance));
				}
				i++;
			}
			j++;
		});
		$('.total_percen').val(formatDecimal(amount_percent));
		$('.total_pay').val(formatDecimal(amount_pay));
		$('.total_amount').val(formatDecimal(amount_total_payment));
	}
});
//==============================end loan=================================

if (gift_card_no = __getItem('gift_card_no')) {
	$('#gift_card_no').val(gift_card_no);
}
$('#gift_card_no').change(function (e) {
	__setItem('gift_card_no', $(this).val());
});

if (amount_1 = __getItem('amount_1')) {
	$('#amount_1').val(amount_1);
}
$('#amount_1').change(function (e) {
	__setItem('amount_1', $(this).val());
});

if (total_balance_1 = __getItem('total_balance_1')) {
	$('#total_balance_1').val(total_balance_1);
}
$('#total_balance_1').change(function (e) {
	__setItem('total_balance_1', $(this).val());
});

if (paid_by_1 = __getItem('paid_by_1')) {
	$('#paid_by_1').val(paid_by_1);
}
$('#paid_by_1').change(function (e) {
	__setItem('paid_by_1', $(this).val());
});

if (pcc_holder_1 = __getItem('pcc_holder_1')) {
	$('#pcc_holder_1').val(pcc_holder_1);
}
$('#pcc_holder_1').change(function (e) {
	__setItem('pcc_holder_1', $(this).val());
});

if (pcc_type_1 = __getItem('pcc_type_1')) {
	$('#pcc_type_1').select2("val", pcc_type_1);
}
$('#pcc_type_1').change(function (e) {
	__setItem('pcc_type_1', $(this).val());
});

if (pcc_month_1 = __getItem('pcc_month_1')) {
	$('#pcc_month_1').val( pcc_month_1);
}
$('#pcc_month_1').change(function (e) {
	__setItem('pcc_month_1', $(this).val());
});

if (pcc_year_1 = __getItem('pcc_year_1')) {
	$('#pcc_year_1').val(pcc_year_1);
}
$('#pcc_year_1').change(function (e) {
	__setItem('pcc_year_1', $(this).val());
});

if (pcc_no_1 = __getItem('pcc_no_1')) {
	$('#pcc_no_1').val(pcc_no_1);
}
$('#pcc_no_1').change(function (e) {
	var pcc_no = $(this).val();
	__setItem('pcc_no_1', pcc_no);
	var CardType = null;
	var ccn1 = pcc_no.charAt(0);
	if(ccn1 == 4)
		CardType = 'Visa';
	else if(ccn1 == 5)
		CardType = 'MasterCard';
	else if(ccn1 == 3)
		CardType = 'Amex';
	else if(ccn1 == 6)
		CardType = 'Discover';
	else
		CardType = 'Visa';

	$('#pcc_type_1').select2("val", CardType);
});

if (cheque_no_1 = __getItem('cheque_no_1')) {
	$('#cheque_no_1').val(cheque_no_1);
}
$('#cheque_no_1').change(function (e) {
	__setItem('cheque_no_1', $(this).val());
});

if (payment_note_1 = __getItem('payment_note_1')) {
	$('#payment_note_1').redactor('set', payment_note_1);
}
$('#payment_note_1').redactor('destroy');
$('#payment_note_1').redactor({
	buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
	formattingTags: ['p', 'pre', 'h3', 'h4'],
	minHeight: 100,
	changeCallback: function (e) {
		var v = this.get();
		__setItem('payment_note_1', v);
	}
});

var old_payment_term;
$('#slpayment_term').focus(function () {
	old_payment_term = $(this).val();
}).change(function (e) {
	var new_payment_term = $(this).val() ? parseFloat($(this).val()) : 0;
	if (!is_numeric($(this).val())) {
		$(this).val(old_payment_term);
		bootbox.alert(lang.unexpected_value);

	} else {
		__setItem('slpayment_term', new_payment_term);
		$('#slpayment_term').val(new_payment_term);
	}
});
if (slpayment_term = __getItem('slpayment_term')) {
	$('#slpayment_term').val(slpayment_term);
}

var old_shipping;
$('#slshipping').focus(function () {
	old_shipping = $(this).val();
}).change(function () {
	if (!is_numeric($(this).val())) {
		$(this).val(old_shipping);
		//bootbox.alert(lang.unexpected_value);
		//old_shipping = $(this).val(0);
		return;
	} else {
		shipping = $(this).val() ? parseFloat($(this).val()) : '0';
	}
	__setItem('slshipping', shipping);
	var gtotal = ((total + invoice_tax) - order_discount) + shipping;
	$('#gtotal').text(formatMoney(gtotal));
	$('#tship').text(formatMoney(shipping));
	$('#sltax2').trigger('change');
});
if (slshipping = __getItem('slshipping')) {
	shipping = parseFloat(slshipping);
	$('#slshipping').val(shipping);
} else {
	shipping = 0;
}

$(document).on('change', '.rserial', function () {
	var item_id = $(this).closest('tr').attr('data-item-id');
	var sep = $(this).closest('tr').attr('sp');
	var ser = $(this).val();
	/*
	if(site.settings.product_serial == 1){
		if(sep == ''){
			//$('#add_sale').removeAttr('disabled');
			$('#before_sub').removeAttr('disabled');
		}else{
			if(ser == ''){
				//$('#add_sale').attr('disabled', 'disabled');
				$('#before_sub').attr('disabled', 'disabled');
			}else{
				if(ser == sep){
					//$('#add_sale').removeAttr('disabled');
					$('#before_sub').removeAttr('disabled');
				}else{
					alert('wrong serial number');
					//$('#add_sale').attr('disabled', 'disabled');
					$('#before_sub').attr('disabled', 'disabled');
				}	
			}
		}
		
	}
	*/
	sloitems[item_id].row.serial = $(this).val();	
	__setItem('sloitems', JSON.stringify(sloitems));
});

// If there is any item in localStorage
if (__getItem('sloitems')) {
	//console.log(__getItem('sloitems'));return;
	loadItems();
}
	// clear localStorage and reload
	$('#reset').click(function (e) {
		bootbox.confirm(lang.r_u_sure, function (result) {
			if (result) {
				if (__getItem('sloitems')) {
					__removeItem('sloitems');
				}
				if (__getItem('sldiscount')) {
					__removeItem('sldiscount');
				}
				if (__getItem('sltax2')) {
					__removeItem('sltax2');
				}
				if (__getItem('slshipping')) {
					__removeItem('slshipping');
				}
				if (__getItem('slref')) {
					__removeItem('slref');
				}
				if (__getItem('slwarehouse')) {
					__removeItem('slwarehouse');
				}
				if (__getItem('slnote')) {
					__removeItem('slnote');
				}
				if (__getItem('slinnote')) {
					__removeItem('slinnote');
				}
				if (__getItem('slcustomer2')) {
					__removeItem('slcustomer2');
				}
				if (__getItem('slcurrency')) {
					__removeItem('slcurrency');
				}
				if (__getItem('sldate')) {
					__removeItem('sldate');
				}
				if (__getItem('slstatus')) {
					__removeItem('slstatus');
				}
				if (__getItem('slbiller')) {
					__removeItem('slbiller');
				}
				if (__getItem('gift_card_no')) {
					__removeItem('gift_card_no');
				}

				$('#modal-loading').show();
				location.reload();
			}
		});
});

// save and load the fields in and/or from localStorage

$('#slref').change(function (e) {
	__setItem('slref', $(this).val());
});
if (slref = __getItem('slref')) {
	$('#slref').val(slref);
}

$('#slwarehouse').change(function (e) {
	__setItem('slwarehouse', $(this).val());
});

	$('#slnote').redactor('destroy');
	$('#slnote').redactor({
		buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
		formattingTags: ['p', 'pre', 'h3', 'h4'],
		minHeight: 100,
		changeCallback: function (e) {
			var v = this.get();
			__setItem('slnote', v);
		}
	});
	if (slnote = __getItem('slnote')) {
		$('#slnote').redactor('set', slnote);
	}
	$('#slinnote').redactor('destroy');
	$('#slinnote').redactor({
		buttons: ['formatting', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'bold', 'italic', 'underline', '|', 'unorderedlist', 'orderedlist', '|', 'link', '|', 'html'],
		formattingTags: ['p', 'pre', 'h3', 'h4'],
		minHeight: 100,
		changeCallback: function (e) {
			var v = this.get();
			__setItem('slinnote', v);
		}
	});
	if (slinnote = __getItem('slinnote')) {
		$('#slinnote').redactor('set', slinnote);
	}

	// prevent default action usln enter
	$('body').bind('keypress', function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});

	// Order tax calculation
	if (site.settings.tax2 != 0) {
		$('#sltax2').change(function () {
			__setItem('sltax2', $(this).val());
			loadItems();

		});
	}

	// Order discount calculation
	var old_sldiscount;
	$('#sldiscount').focus(function () {
		old_sldiscount = $(this).val();
	}).change(function () {
		var new_discount = $(this).val() ? $(this).val() : '0';
		if (is_valid_discount(new_discount) && (new_discount > -1 && new_discount < 101)) {
			__removeItem('sldiscount');
			__setItem('sldiscount', new_discount);
			loadItems();

        } else {
			bootbox.alert(lang.unexpected_value);
			$(this).val(old_sldiscount);

        }

	});


	/* ----------------------
	 * Delete Row Method
	 * ---------------------- */
	$(document).on('click', '.sldel', function () {
		
		
		var row = $(this).closest('tr');
		var item_id = row.attr('data-item-id');
		delete sloitems[item_id];
		row.remove();
		console.log(count);
        if (count == 2) {
            $('#slbiller').select2('readonly', false);
            $('#slwarehouse').select2('readonly', false);

        }
		if(sloitems.hasOwnProperty(item_id)) { } else {
			__setItem('sloitems', JSON.stringify(sloitems));
			loadItems();

        }
		
		/*
		var row = $(this).closest('tr');
		var item_id = row.attr('data-item-id');
		var qty = $(this).attr('qty');
		var id = $(this).attr('ids');
		var edit = $('#edit_id').val();
		var ware = $('#warehouse_id').val();
		row.remove();
		
		$.ajax({
			type: "GET",
			url: site.base_url+'sales/sale_edit',
			data: {id:id, qty:qty, edit_id:edit, ware:ware},
			dataType: "text",
			success: function(resultData){
				delete sloitems[item_id];
				row.remove();
				if(sloitems.hasOwnProperty(item_id)) { } else {
					__setItem('sloitems', JSON.stringify(sloitems));
					loadItems();
					return;
				}
			}
		});
		
		*/
		
	});
	
	


	/* -----------------------
	 * Edit Row Modal Hanlder
	 ----------------------- */
	 $(document).on('click', '.edit', function () {

		var row 			= $(this).closest('tr');
		var row_id 			= row.attr('id');
		item_id 			= row.attr('data-item-id');
		item 				= sloitems[item_id];
		var qty 			= row.children().children('.rquantity').val(),
		product_option 		= row.children().children('.roption').val(),
		unit_price 			= row.children().children('.ruprice').val(),
		discount 			= row.children().children('.rdiscount').val();
		var default_price 	= formatDecimal(row.find('.default_price').val());
		var net_price 		= unit_price;

		$('#prModalLabel').text(item.row.name + ' (' + item.row.code + ')');

		if (site.settings.tax1) {
			$('#ptax').select2('val', item.row.tax_rate);
	 		$('#old_tax').val(item.row.tax_rate);
	 		var item_discount = 0, ds = discount ? discount : '0';
			
	 		if (ds.indexOf("%") !== -1) {
                var pds = ds.split("%");
                if (!isNaN(pds[0])) {
                    item_discount = parseFloat(((unit_price*qty) * (parseFloat(pds[0]) / 100))/qty);
                } else {
                    item_discount = parseFloat(ds/qty);
                }
            } else {
                item_discount = parseFloat(ds/qty);
            }
			
			net_price-=item_discount;
			
	 		var pr_tax = item.row.tax_rate, pr_tax_val = 0;
			
 		    if (pr_tax !== null && pr_tax != 0) {
 		        $.each(tax_rates, function () {
 		        	if(this.id == pr_tax){
 			        	if (this.type == 1) {
 			        		if (sloitems[item_id].row.tax_method == 0) {
 			        			pr_tax_val = formatDecimal(((net_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate)));
                                pr_tax_rate = formatDecimal(this.rate) + '%';
                                net_price -= pr_tax_val;
 			        		} else {
 			        			pr_tax_val = formatDecimal(((net_price) * parseFloat(this.rate)) / 100);
                                pr_tax_rate = formatDecimal(this.rate) + '%';
 			        		}
 			        	} else if (this.type == 2) {
 			        		pr_tax_val = parseFloat(this.rate);
                            pr_tax_rate = this.rate;

 			        	}
 			        }
 			    });
 		    }
		}
		
		if (site.settings.product_serial !== 0) {
			$('#pserial').val(row.children().children('.rserial').val());
		}
		
		var opt = '<p style="margin: 12px 0 0 0;">n/a</p>';
		if(item.options !== false && item.options != '') {
			var o = 1;
			opt = $("<select id=\"poption\" name=\"poption\" class=\"form-control select\" />");
			
			$.each(item.options, function () {
				if(o == 1) {
					$('#lbpiece').text(this.name);
					$('#piece').val(item.row.piece);
					$('#wpiece').val(formatDecimal((item.row.wpiece ? item.row.wpiece : this.qty_unit)));
				}
				if(o == item.options.length) {
					if(product_option == '') { product_variant = this.id; } else { product_variant = product_option; }
				}
				$("<option />", {value: this.id, text: this.name}).attr("rate",item.row.cost).attr("qty_unit",this.qty_unit).attr("makeup_cost_percent",item.makeup_cost_percent).appendTo(opt);
				o++;
			});
		}else {
			$('#lbpiece').text("Piece");
			$('#piece').val(item.row.piece);
			$('#wpiece').val(formatDecimal((Number(item.row.wpiece) ? item.row.wpiece : 1)));
		}
		
		var opt_group_price = '<p style="margin: 12px 0 0 0;">n/a</p>';
		if(item.all_group_prices) {
			var gp = 1;
			opt_group_price = $("<select id=\"pgroup_price\" name=\"pgroup_price\" class=\"form-control select\" />");
			
			$.each(item.all_group_prices, function () {
				if(gp == 1) {
					$("<option />", {value: 0, text: 'Default Price'}).appendTo(opt_group_price);
					if(item.row.price_id == 0) {
						$("<option />", {value: this.id, text: this.group_name + ' (' + formatDecimal(this.price) + ' '+ this.currency_code +') (' + this.variant_name + ')'}).attr("rate",this.rate).attr("datacurrency_code",this.currency_code).attr("data-unit-id", this.unit_id).appendTo(opt_group_price);
					}else{
						$("<option />", {value: this.id, text: this.group_name + ' (' + formatDecimal(this.price) + ' '+ this.currency_code +') (' + this.variant_name + ')'}).attr("rate",this.rate).attr("datacurrency_code",this.currency_code).attr("data-unit-id", this.unit_id).appendTo(opt_group_price);
					}
				}else{
					$("<option />", {value: this.id, text: this.group_name + ' (' + formatDecimal(this.price) + ' '+ this.currency_code +') (' + this.variant_name + ')'}).attr("rate",this.rate).attr("datacurrency_code",this.currency_code).attr("data-unit-id", this.unit_id).appendTo(opt_group_price);
				}
				gp++;
			});
		}
		
		$('#pnote').val(item.row.note);
		$('#poptions-div').html(opt);

		$('#pgroup_prices-div').html(opt_group_price);
		$('select.select').select2({minimumResultsForSearch: 6});
		$('#pquantity').val(qty);
		$('#old_qty').val(qty);
		$('#pprice').val(unit_price);
		$('#punit_price').val(formatDecimal(parseFloat(unit_price)+parseFloat(pr_tax_val)));
		$('#poption').select2('val', item.row.option);
		$('#pgroup_price').select2('val', item.row.price_id);

		$('#old_price').val(unit_price);
		$('#row_id').val(row_id);
		$('#item_id').val(item_id);
		$('#pserial').val(row.children().children('.rserial').val());
		$('#pdiscount').val(discount);
		$('#net_price').text(formatMoney(net_price));
	    $('#pro_tax').text(formatMoney(pr_tax_val));
		$('#prModal').appendTo("body").modal('show');
		$('#pdiscount').trigger('change');
		$('#piece').trigger('change');
		//$("#poption").trigger('change');
		$("#group_price").trigger('change');
		//if(item.row.group_price_id) {
		//	$("#group_price").val(item.row.group_price_id).trigger('change');
		//}
		
		//$('#poption').trigger("change");
		$('#pgroup_price').trigger("change");
		
	});


	$('#piece').focus(function() {
		$(this).select();
	});

	$('#prModal').on('shown.bs.modal', function (e) {
		if($('#poption').select2('val') != '') {
			$('#poption').select2('val', product_variant);
			product_variant = 0;
		}
	});
	
		$(document).on('change', '#pprice, #ptax, #pdiscount,#pquantity', function () {
			var row = $('#' + $('#row_id').val());
			var item_id = row.attr('data-item-id');
			var unit_price = parseFloat($('#pprice').val());
			var item = sloitems[item_id];
			var item_qty = parseFloat($('#pquantity').val());
			var ds = $('#pdiscount').val() ? $('#pdiscount').val() : '0';
			if (ds.indexOf("%") !== -1) {
				var pds = ds.split("%");
				if (!isNaN(pds[0])) {
					item_discount = parseFloat(((unit_price*item_qty) * parseFloat(pds[0] / 100))/item_qty);
				} else {
					item_discount = parseFloat(ds / item_qty);
				}
			} else {
				item_discount = parseFloat(ds / item_qty);
			}
			
			var pr_tax = $('#ptax').val(), item_tax_method = item.row.tax_method;
			var pr_tax_val = 0, pr_tax_rate = 0;
			unit_price = unit_price - item_discount;
			
			if (pr_tax !== null && pr_tax != 0) {
				$.each(tax_rates, function () {
					if(this.id == pr_tax){
						if (this.type == 1) {
							if (item_tax_method == 0) {
								pr_tax_val = formatDecimal((unit_price * parseFloat(this.rate)) / (100 + parseFloat(this.rate)));
								pr_tax_rate = formatDecimal(this.rate) + '%';
								unit_price -= pr_tax_val;
							} else {
								pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / 100);
								pr_tax_rate = formatDecimal(this.rate) + '%';
							}
							
						} else if (this.type == 2) {
							pr_tax_val = parseFloat(this.rate);
							pr_tax_rate = this.rate;

						}
					}
				});
			}
			$('#net_price').text(formatMoney(unit_price));
			$('#pro_tax').text(formatMoney(pr_tax_val));
		});
	
	/* -----------------------
	 * Edit Row Method
	 ----------------------- */
	 $(document).on('click', '#editItem', function () {
		var row = $('#' + $('#row_id').val());
		var item_id = row.attr('data-item-id'), new_pr_tax = $('#ptax').val(), new_pr_tax_rate = false;
		if (new_pr_tax) {
			$.each(tax_rates, function () {
				if (this.id == new_pr_tax) {
					new_pr_tax_rate = this;
				}
			});
		}
		
		var price = parseFloat($('#pprice').val());
		var pquantity = parseFloat($('#pquantity').val());
		var total_price = price * pquantity;
		
		if (site.settings.product_discount == 1 && $('#pdiscount').val()) {
			if(!is_valid_discount($('#pdiscount').val()) || $('#pdiscount').val() > total_price) {
				bootbox.alert(lang.unexpected_value);
				return false;
			}
		}
		if (site.settings.product_discount == 1 && $('#pdiscount').val()) {
			if(!is_valid_discount($('#pdiscount').val()) || $('#pdiscount').val() > total_price) {
				bootbox.alert(lang.unexpected_value);
				return false;
			}
		}
		if (!is_numeric($('#pquantity').val()) || parseFloat($('#pquantity').val()) < 0) {
		    $(this).val(old_row_qty);
		    bootbox.alert(lang.unexpected_value);
		    return;
		}
		
		var opt_cur = $("#pgroup_price option:selected").attr('rate');
		
		//alert(JSON.stringify(opt_cur));
		if(opt_cur == undefined)
		{
			price = (price);
		}else{
			price = (price*opt_cur);
		}
		
		var piece  = $("#piece").val()-0;
		var wpiece = $("#wpiece").val()-0;
		sloitems[item_id].row.piece = piece;
		sloitems[item_id].row.wpiece = wpiece;
		sloitems[item_id].row.qty = parseFloat($('#pquantity').val()),
		sloitems[item_id].row.real_unit_price = price,
		sloitems[item_id].row.tax_rate = new_pr_tax,
	 	sloitems[item_id].tax_rate = new_pr_tax_rate,
		sloitems[item_id].row.discount = $('#pdiscount').val() ? $('#pdiscount').val() : '',
		sloitems[item_id].row.option = $('#poption').val() ? $('#poption').val() : '',
		//sloitems[item_id].row.price_id = $('#group_price').val() ? $('#group_price').val() : '',
		sloitems[item_id].row.note = $('#pnote').val() ? $('#pnote').val() : '',
		sloitems[item_id].row.serial = $('#pserial').val();
		sloitems[item_id].row.promo_price = $('#pdiscount').val() ? $('#pdiscount').val() : '',
		sloitems[item_id].row.price_id = $('#pgroup_price').val() ? $('#pgroup_price').val() : '';
		
	//	alert(price);item.row.item_load
		
		if(sloitems[item_id].group_prices){
			sloitems[item_id].row.rate_item_cur = opt_cur,
			sloitems[item_id].row.load_item=0;
			sloitems[item_id].row.item_load=0;
			//sloitems[item_id].group_prices[0].rate = opt_cur;
			sloitems[item_id].group_prices[0].price = price;
			sloitems[item_id].group_prices[0].id = $('#pgroup_price').val() ? $('#pgroup_price').val() : '';
		}
		__setItem('sloitems', JSON.stringify(sloitems));
		$('#prModal').modal('hide');

		loadItems();

     });

	/* -----------------------
	 * Product option change
	 ----------------------- */
	/* $(document).on('change', '#poption_old', function () {
		var row = $('#' + $('#row_id').val()), opt = $(this).val();
		var item_id = row.attr('data-item-id');
		var item = sloitems[item_id];
		if(item.options !== false) {
			var opt_txt = $("#poption option:selected").text();
			$.each(item.options, function () {
				if(this.id == opt && this.price != 0 && this.price != '' && this.price != null) {
					$('#pprice').val(formatMoney(this.price));
					$("#net_price").text(formatMoney(this.price));
				}
				
				if(item.group_price) {
					var o = 1;
					opt1 = $("<select id=\"group_price\" name=\"group_price\" class=\"form-control select\" />");
					var opt111 = '';
					$.each(item.group_price, function () {
						if(this.unit == opt_txt){
							// $("<option />", {value: this.id, text: formatDecimal(parseFloat(this.price))+" (" + this.currency + ") (" + this.group_name + ")" }).appendTo(opt1);
							opt111 += '<option value="'+ this.id +'">' + formatDecimal(parseFloat(this.price))+" (" + this.currency_code + ") (" + this.group_name + ")" + '</option>';
						}
						o++;
					});
					$("#group_price").find('option')
								.remove()
								.end()
								.append(opt111);
					
					//$('#poptions-div').empty();
					//$('#poptions-div').html(opt);
				}
			});
		}
	}); */
	
	/* $(document).on('change', '#poption', function () {
		var row = $('#' + $('#row_id').val()), opt = $(this).val();
		var item_id = row.attr('data-item-id');
		var item = sloitems[item_id];
		
		if(item.options !== false) {
			var opt_txt = $("#poption option:selected").text();
			$.each(item.options, function () {
				if(this.id == opt && this.price != 0 && this.price != '' && this.price != null) {
					$('#pprice').val(formatMoney(this.price));
					$("#net_price").text(formatMoney(this.price));
				}
			});
		}
	}); */
	
	/*
	$(document).on('change', '#poption', function () {
		var row = $('#' + $('#row_id').val());
		var opt = $(this).val();
	 	var item_id = row.attr('data-item-id');
	 	var item = sloitems[item_id];
	 	if(item.options !== false) {
	 		$.each(item.options, function () {
	 			if(this.id == opt && this.price != 0) {
					if(site.settings.attributes == 1)
					{
						 var pro_mkp	=  $("#poption option:selected").attr('makeup_cost_percent');
						 
						if(item.makeup_cost == 1 && pro_mkp != undefined)
						{
							var pro_opt = $("#poption option:selected").attr('rate');
							var pro_qty = $("#poption option:selected").attr('qty_unit');
							var pro_mkp	=  $("#poption option:selected").attr('makeup_cost_percent');
							var price   = (pro_opt*pro_qty)+((pro_opt*pro_qty)*(isNaN(pro_mkp)?0:pro_mkp)/100);
							
							$('#pprice').val(formatDecimal(price));
							$("#net_price").text(formatMoney(price));
						}else{
							$('#pprice').val(this.price);
							$("#net_price").text(formatMoney(this.price));
						}	
					}else{
						$('#pprice').val(this.price);
						$("#net_price").text(formatMoney(this.price));
					}
	 			}
	 		});
	 	}
		
		$("#pprice").trigger("change");
	 });
	 */
	 
	 $(document).on('change', '#poption', function () {
	 	var row 			= $('#' + $('#row_id').val());
		var item_id 		= row.attr('data-item-id');
	 	var item 			= sloitems[item_id];
		var  opt 			= $(this).val();
		var warehouse_id 	= $("#slwarehouse").val();
		var pquantity 		= $("#pquantity").val();
		var exp_id 			= $("#expdate").val();
		var product_code 	= item.row.code;
		
	 	var current_price_group = $("#pgroup_price").val();
	 	if(item.options !== false) {
	 		$.each(item.options, function () {
                if(this.id == opt) {
                    var price	= parseFloat(this.price);
                    var pro_mkp	=  $("#poption option:selected").attr('makeup_cost_percent');
                    if(item.makeup_cost == 1 && pro_mkp != undefined) {
                        var pro_opt = $("#poption option:selected").attr('rate');
                        var pro_qty = $("#poption option:selected").attr('qty_unit');
                        var pro_mkp	=  $("#poption option:selected").attr('makeup_cost_percent');
                        price 		= (pro_opt*pro_qty)+((pro_opt*pro_qty)*(isNaN(pro_mkp)?0:pro_mkp)/100);

                    }
                    price 		= (parseFloat(price)+((parseFloat(price)*item.customer_percent)/100));
                    $('#pprice').val(price);
                    $("#net_price").text(formatMoney(price));
                    $('#pprice_show').val(formatDecimal(price));
                }
	 		});
	 	}
	 	if(item.all_group_prices !== false){
             var new_group_price_id = $("#pgroup_price option[data-unit-id='"+opt+"']").val();
             $('#pgroup_price option').attr('disabled', false);
             $.each($('#pgroup_price option').not(':first-child'), function () {
                 var val = $(this).val();
                 var data_unit_id = $(this).attr('data-unit-id');
                 if(data_unit_id != opt){
                     $(this).attr('disabled', true);
                 }
             });

             if(current_price_group > 0){
                 if(item.row.price_id == current_price_group && opt == item.row.option){
                     $('#pgroup_price').select2('val', item.row.price_id);
                 }else{
                     $('#pgroup_price').select2('val', new_group_price_id);
                 }
                 $("#pgroup_price").trigger('change');
             }else{
                 $('#pgroup_price').select2('val', current_price_group);
             }
	 	}
		//$("#pprice").trigger("change");
	});
	
	
	/* -----------------------
	 * Product Group Price change
	 ----------------------- */
	$(document).on('change', '#pgroup_price', function () {
		var row = $('#' + $('#row_id').val()), opt = $(this).val();
		var item_id = row.attr('data-item-id');
		var item = sloitems[item_id];
		var exchange_rate = $("#exchange_rate").val();
		var default_price = formatDecimal(row.find('.default_price').val());
		var old_price = $('#old_price').val();

		if(item.all_group_prices !== false) {
			$.each(item.all_group_prices, function () {
				var price =0;
				var rate  =0;

				if(opt ==0){
                    if(item.options !== false) {
                        $('#poption').trigger('change');
                    }else{
                        price = (default_price+((default_price*item.customer_percent)/100));
                        $('#pprice,#pprice_show').val(price);
                        $("#net_price").text(formatMoney(price));
					}
				}else{
					if(this.id == opt) {
						if(this.rate!=0)
						{
							rate  = (this.price)-0;
							price = (rate+((rate*item.customer_percent)/100));
							$('#pprice,#pprice_show').val(parseFloat((price/this.rate)*1).toFixed(2));
							$("#net_price").text(formatMoney((price/this.rate)*1));
						}else{
							$('#pprice,#pprice_show').val(parseFloat(price).toFixed(2));
							$("#net_price").text(formatMoney(price));
						}
					}
				}
			});
		}else if(opt == 0){
			$('#poption').trigger('change');
		}
		
		$("#ptax").trigger("change");
	});

	 /* ------------------------------
	 * Sell Gift Card modal
	 ------------------------------- */
	 $(document).on('click', '#sellGiftCard', function (e) {
		if (count == 1) {
			sloitems = {};
			if ($('#slwarehouse').val() && $('#slcustomer2').val()) {
				//$('#slcustomer').select2("readonly", true);
				//$('#slwarehouse').select2("readonly", true);
			} else {
				bootbox.alert(lang.select_above);
				item = null;
				return false;
			}
		}
		$('#gcModal').appendTo("body").modal('show');
		return false;
	 });

	 $(document).on('click', '#addGiftCard', function (e) {
		var mid = (new Date).getTime(),
		gccode = $('#gccard_no').val(),
		gcname = $('#gcname').val(),
		gcvalue = $('#gcvalue').val(),
		gccustomer = $('#gccustomer').val(),
		gcexpiry = $('#gcexpiry').val() ? $('#gcexpiry').val() : '',
		gcprice = parseFloat($('#gcprice').val());
		if(gccode == '' || gcvalue == '' || gcprice == '' || gcvalue == 0 || gcprice == 0) {
			$('#gcerror').text('Please fill the required fields');
			$('.gcerror-con').show();
			return false;
		}

         var gc_data = [];
		gc_data[0] = gccode;
		gc_data[1] = gcvalue;
		gc_data[2] = gccustomer;
		gc_data[3] = gcexpiry;
		//if (typeof sloitems === "undefined") {
		//    var sloitems = {};
		//}

		$.ajax({
			type: 'get',
			url: site.base_url+'sales/sell_gift_card',
			dataType: "json",
			data: { gcdata: gc_data },
			success: function (data) {
				if(data.result === 'success') {
					sloitems[mid] = {"id": mid, "item_id": mid, "label": gcname + ' (' + gccode + ')', "row": {"id": mid, "code": gccode, "name": gcname, "quantity": 1, "price": gcprice, "real_unit_price": gcprice, "tax_rate": 0, "qty": 1, "type": "manual", "discount": "0", "serial": "", "option":""}, "tax_rate": false, "options":false};
					__setItem('sloitems', JSON.stringify(sloitems));
					loadItems();
					$('#gcModal').modal('hide');
					$('#gccard_no').val('');
					$('#gcvalue').val('');
					$('#gcexpiry').val('');
					$('#gcprice').val('');
				} else {
					$('#gcerror').text(data.message);
					$('.gcerror-con').show();
				}
			}
		});
		return false;
	});

	/* ------------------------------
	 * Show manual item addition modal
	 ------------------------------- */
	 $(document).on('click', '#addManually', function (e) {
		 	
		if (count == 1) {
			sloitems = {};
			if ($('#slwarehouse').val() && $('#slcustomer').val()) {
				var sup = $("#slcustomer").val();
					var wh = $("#slwarehouse").val();
				 __setItem('slcustomer', sup);
				 __setItem('slwarehouse', wh);
				$('#slcustomer').select2("readonly", true);
				$('#slwarehouse').select2("readonly", true);
			} else {
				bootbox.alert(lang.select_above);
				item = null;
				return false;
			}
		}
		$('#mnet_price').text('0.00');
		$('#mpro_tax').text('0.00');
		$('#mModal').appendTo("body").modal('show');
		return false;
	});

	 $(document).on('click', '#addItemManually', function (e) {
		var mid = (new Date).getTime(),
		mcode = $('#mcode').val(),
		mname = $('#mname').val(),
		mtax = parseInt($('#mtax').val()),
		mqty = parseFloat($('#mquantity').val()),
		mdiscount = $('#mdiscount').val() ? $('#mdiscount').val() : '0',
		unit_price = parseFloat($('#mprice').val()),
		mtax_rate = {};
		$.each(tax_rates, function () {
			if (this.id == mtax) {
				mtax_rate = this;
			}
		});

		sloitems[mid] = {"id": mid, "item_id": mid, "label": mname + ' (' + mcode + ')', "row": {"id": mid, "code": mcode, "name": mname, "quantity": mqty, "price": unit_price, "unit_price": unit_price, "real_unit_price": unit_price, "tax_rate": mtax, "tax_method": 0, "qty": mqty, "type": "manual", "discount": mdiscount, "serial": "", "option":""}, "tax_rate": mtax_rate, "options":false};
		__setItem('sloitems', JSON.stringify(sloitems));
		loadItems();
		$('#mModal').modal('hide');
		$('#mcode').val('');
		$('#mname').val('');
		$('#mtax').val('');
		$('#mquantity').val('');
		$('#mdiscount').val('');
		$('#mprice').val('');
		return false;
	});

	$(document).on('change', '#mprice, #mtax, #mdiscount', function () {
	    var unit_price = parseFloat($('#mprice').val());
	    var ds = $('#mdiscount').val() ? $('#mdiscount').val() : '0';
	    if (ds.indexOf("%") !== -1) {
	        var pds = ds.split("%");
	        if (!isNaN(pds[0])) {
	            item_discount = parseFloat(((unit_price) * parseFloat(pds[0])) / 100);
	        } else {
	            item_discount = parseFloat(ds);
	        }
	    } else {
	        item_discount = parseFloat(ds);
	    }
	    unit_price -= item_discount;
	    var pr_tax = $('#mtax').val(), item_tax_method = 0;
	    var pr_tax_val = 0, pr_tax_rate = 0;
	    if (pr_tax !== null && pr_tax != 0) {
	        $.each(tax_rates, function () {
	        	if(this.id == pr_tax){
		        	if (this.type == 1) {

		        		if (item_tax_method == 0) {
		        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / (100 + parseFloat(this.rate)));
		        			pr_tax_rate = formatDecimal(this.rate) + '%';
		        			unit_price -= pr_tax_val;
		        		} else {
		        			pr_tax_val = formatDecimal(((unit_price) * parseFloat(this.rate)) / 100);
		        			pr_tax_rate = formatDecimal(this.rate) + '%';
		        		}

		        	} else if (this.type == 2) {

		        		pr_tax_val = parseFloat(this.rate);
		        		pr_tax_rate = this.rate;

		        	}
		        }
		    });
	    }

	    $('#mnet_price').text(formatMoney(unit_price));
	    $('#mpro_tax').text(formatMoney(pr_tax_val));
	});

	/* --------------------------
	 * Edit Row Quantity Method
	 -------------------------- */
	 var old_row_qty;
	 $(document).on("focus", '.rquantity', function () {
		old_row_qty = $(this).val();
	}).on("change", '.rquantity', function () {
		var row = $(this).closest('tr');
		if (!is_numeric($(this).val())) {
			$(this).val(old_row_qty);
			bootbox.alert(lang.unexpected_value);
			return;
		}
		var new_qty = parseFloat($(this).val()),
		item_id = row.attr('data-item-id');
		sloitems[item_id].row.qty = new_qty;
		__setItem('sloitems', JSON.stringify(sloitems));
		loadItems();
	});

	/* --------------------------
	 * Edit Row Price Method
	 -------------------------- */
	var old_price;
	$(document).on("focus", '.rprice', function () {
		old_price = $(this).val();
	}).on("change", '.rprice', function () {
		var row = $(this).closest('tr');
		if (!is_numeric($(this).val())) {
			$(this).val(old_price);
			bootbox.alert(lang.unexpected_value);
			return;
		}
		var new_price = parseFloat($(this).val()),
		item_id = row.attr('data-item-id');
		sloitems[item_id].row.price = new_price;
		__setItem('sloitems', JSON.stringify(sloitems));
		loadItems();
	});

	$(document).on("click", '#removeReadonly', function () {
		$('#slcustomer2').select2('readonly', false);
		$('#slcustomer').select2('readonly', false);
		//$('#slwarehouse').select2('readonly', false);
		return false;
	});

});
/* -----------------------
 * Misc Actions
 ----------------------- */

// hellper function for customer if no localStorage value
function nsCustomer() {
	$('#slcustomer').select2({
		minimumInputLength: 1,
		ajax: {
			url: site.base_url + "customers/suggestions",
			dataType: 'json',
			quietMillis: 15,
			data: function (term, page) {
				return {
					term: term,
					limit: 10
				};
			},
			results: function (data, page) {
				if (data.results != null) {
					return {results: data.results};
				} else {
					return {results: [{id: '', text: 'No Match Found'}]};
				}
			}
		}
	});
}
/*===============================================chin local updated====================================*/
//localStorage.clear();
function loadItems() {
	if (__getItem('sloitems')) {
		total = 0;
		count = 1;
		an = 1;
		product_tax = 0;
		invoice_tax = 0;
		product_discount = 0;
		order_discount = 0;
		total_discount = 0;
		$("#slTable tbody").empty();
		sloitems = JSON.parse(__getItem('sloitems'));

		var sale_order_price = 0;
		if (gp) {
			var sale_order_price = gp['sale_order-price'];
		}

		var no=1;
		$.each(sloitems, function () {
			var item = this;
			var item_id 		= site.settings.item_addition == 1 ? item.id : item.id;
			//var item_id 		= site.settings.item_addition == 1 ? item.item_id : item.id;
			sloitems[item_id] 	= item;
			var product_id 		= item.row.id, 
			item_type 			= item.row.type, 
			item_promotion 		= item.row.promotion, 
			item_pro_price 		= item.row.promo_price, 
			combo_items 		= item.combo_items, 
			item_price 			= item.row.price, 
			item_qty 			= item.row.qty, 
			item_qoh 			= ((item.row.qoh > 0) ? item.row.qoh : 0),
			psoqty				= item.row.psoqty,
			item_aqty 			= item.row.quantity, 
			item_qty_received 	= item.row.qty_received, 
			item_tax_method 	= item.row.tax_method, 
			item_ds 			= item.row.discount, 
			item_discount 		= 0, 
			item_option 		= item.row.option,
			group_prices 		= item.group_prices,
			all_group_prices 	= item.all_group_prices,
			price_id 			= item.row.price_id,
			group_price_id 		= item.row.price_id, 
			item_code 			= item.row.code, 
			digital_code 		= item.row.digital_code,
			item_serial 		= item.row.serial, 
			item_note 			= item.row.note, 
			item_item_cur 		= item.row.rate_item_cur,
			//item_load     	= item.row.load_item,
			item_name 			= item.row.name.replace(/"/g, "&#034;").replace(/'/g, "&#039;"), 
			digital_name 		= item.row.digital_name.replace(/"/g, "&#034;").replace(/'/g, "&#039;"), 
			digital_id 			= item.row.digital_id?item.row.digital_id:0,
			sep 				= item.row.sep;
			piece 				= item.row.piece; 	
			wpiece 				= item.row.wpiece;

			if(item.row.start_date) {
				var start_date = moment(item.row.start_date).format('DD/MM/YYYY');
			}else {
				var start_date = null;
			}
			if(item.row.end_date) {
				var end_date = moment(item.row.end_date).format('DD/MM/YYYY');
			} else {
				var end_date = null;
			}
			var current_date = moment(new Date()).format('DD/MM/YYYY');
			
			var unit_price = item.row.real_unit_price;
			var real_unit_price = item.row.real_unit_price;
			
			var exchange_rate = $("#exchange_rate").val();
			var is_edit = $("#is_edit").val() ? $("#is_edit").val() : 0;
			
			var default_price = 0;
			
			if(is_edit == 0){
				if(item_promotion && item.row.start_date && item.row.end_date){
					var pro_start_date = moment(item.row.start_date).format('DD/MM/YYYY');
					var pro_end_date = moment(item.row.end_date).format('DD/MM/YYYY');
					var currentDate = moment().format('DD/MM/YYYY');
					
					if(currentDate >= pro_start_date && currentDate <= pro_end_date){
						item_ds = item_pro_price;
					}
				}
				//if(site.settings.attributes == 0)
				//{
					//if(item.row.is_sale_order==0)
					//{
						if(all_group_prices){
							$.each(all_group_prices, function(){
								if(item_option && item_option == this.unit_id){
									if(price_id == this.id){
										var cur_price_1 = this.price;
										if(item.makeup_cost == 1){
											
											if(item_item_cur!=0){
												cur_price_1 = ((cur_price_1/item_item_cur)*1);
											}else{
												cur_price_1 = ((cur_price_1)*1);
											}

											if(item.row.item_load==0)
											{
												//cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
											}
											if(real_unit_price == cur_price_1){
												item_price = cur_price_1;
												unit_price = cur_price_1;
												real_unit_price = cur_price_1;
											}
											item.row.price_id = this.id;
										}else{
											
											if(item_item_cur!=0){
												cur_price_1 = ((cur_price_1/item_item_cur)*1);
											}else{
												cur_price_1 = ((cur_price_1)*1);
											}
											cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
											if(real_unit_price == cur_price_1){
												item_price = cur_price_1;
												unit_price = cur_price_1;
												real_unit_price = cur_price_1;
											}
											item.row.price_id = this.id;
										}
									}
								}else if(!item_option){
									if(price_id == this.id){
										var cur_price_1 = this.price;
										if(item.makeup_cost == 1){
											
											if(item_item_cur!=0){
												cur_price_1 = ((cur_price_1/item_item_cur)*1);
											}else{
												cur_price_1 = ((cur_price_1)*1);
											}
												
											if(item.row.item_load==0)
											{
												//cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
											}
											
											
											if(price_id==this.id)
											{
												if(real_unit_price == cur_price_1){
													item_price = cur_price_1;
													unit_price = cur_price_1;
													real_unit_price = cur_price_1;
												}
												item.row.price_id = this.id;
											}
											
										}else{
											
											if(item_item_cur!=0){
												cur_price_1 = ((cur_price_1/item_item_cur)*1);
											}else{
												cur_price_1 = ((cur_price_1)*1);
											}
										
											cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
											
											if(real_unit_price == cur_price_1){
												item_price = cur_price_1;
												unit_price = cur_price_1;
												real_unit_price = cur_price_1;
											}
											item.row.price_id = this.id;
										}
									}
								}
								//price_id    = item.row.price_id;
							});
							
						}
					//}
				//}
				
			}else{
				
				//if(site.settings.attributes == 0)
				//{
					if(item.row.item_load==0)
					{
						if(all_group_prices){
							$.each(all_group_prices, function(){
								if(item_option && item_option == this.unit_id){
									if(price_id == this.id){
										var cur_price_1 = this.price;
										if(item.makeup_cost == 1){
											
											if(item_item_cur!=0){
												cur_price_1 = ((cur_price_1/item_item_cur)*1);
											}else{
												cur_price_1 = ((cur_price_1)*1);
											}
												
											if(item.row.item_load==0)
											{
												//cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
											}
											if(real_unit_price == cur_price_1){
												item_price = cur_price_1;
												unit_price = cur_price_1;
												real_unit_price = cur_price_1;
											}
											item.row.price_id = this.id;
											
										}else{
											
											if(item_item_cur!=0){
												cur_price_1 = ((cur_price_1/item_item_cur)*1);
											}else{
												cur_price_1 = ((cur_price_1)*1);
											}
										
											cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
											
											if(real_unit_price == cur_price_1){
												item_price = cur_price_1;
												unit_price = cur_price_1;
												real_unit_price = cur_price_1;
											}
											item.row.price_id = this.id;
											
										}
									}
								}else if(!item_option){
									var cur_price_1 = this.price;
									if(item.makeup_cost == 1){
										
										if(item_item_cur!=0){
											cur_price_1 = ((cur_price_1/item_item_cur)*1);
										}else{
											cur_price_1 = ((cur_price_1)*1);
										}
											
										if(item.row.item_load==0)
										{
											//cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
										}
										if(price_id==this.id)
										{
											if(real_unit_price == cur_price_1){
												item_price = cur_price_1;
												unit_price = cur_price_1;
												real_unit_price = cur_price_1;
											}
											item.row.price_id = this.id;
										}
									}else{
										
										if(item_item_cur!=0){
											cur_price_1 = ((cur_price_1/item_item_cur)*1);
										}else{
											cur_price_1 = ((cur_price_1)*1);
										}
									
										cur_price_1 = parseFloat(cur_price_1) + parseFloat((cur_price_1 * item.customer_percent) / 100);
										if(real_unit_price == cur_price_1){
											item_price = cur_price_1;
											unit_price = cur_price_1;
											real_unit_price = cur_price_1;
										}
										item.row.price_id = this.id;
									}
								}
								
								//alert(JSON.stringify(group_price_id));
								
								//default_price = this.default_price;
								// price_id    = item.row.price_id; 
							});
							
						}
				    }
				//}
			}
			
			var pn 				= item_note ? item_note : '';
            var ds 				= item_ds ? item_ds : 0;
			var price_tax_cal 	= unit_price;
			//====================== Tax ====================//
			if (site.settings.tax_calculate != 0) {
				var prt = item.tax_rate;
				if (site.settings.tax1 == 1) {
					if (prt !== false) {
						if (prt.type == 1) {
							
							if (item_tax_method == '0') {  							
								price_tax_cal 	= (unit_price * 100) / (100 + parseFloat(prt.rate)); 		
							} else {
								price_tax_cal 	= unit_price;
							}

						}
					}
				}
			} 
			//====================== End ===================//
			
			if (ds.indexOf("%") !== -1) {
				var pds = ds.split("%");
				if (!isNaN(pds[0])) {
					item_discount = parseFloat(((price_tax_cal*item_qty) * parseFloat(pds[0] / 100))/item_qty);
				} else {
					item_discount = parseFloat(ds / item_qty);
				}
			} else {
				item_discount = parseFloat(ds / item_qty);
				
			}
			
			if(isNaN(item_discount)){
				item_discount = 0;
			}
			unit_price = unit_price - item_discount;
            product_discount += parseFloat(item_discount * item_qty);
			var pr_tax = item.tax_rate;
			var pr_tax_val = 0, pr_tax_rate = 0;
			
			if (site.settings.tax1 == 1) {
				if (pr_tax !== false) {
					if (pr_tax.type == 1) {

						if (item_tax_method == '0') {
							pr_tax_val = (((unit_price) * parseFloat(pr_tax.rate)) / (100 + parseFloat(pr_tax.rate)));
							pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
						} else {
							pr_tax_val = ((unit_price * parseFloat(pr_tax.rate)) / 100);
							pr_tax_rate = formatDecimal(pr_tax.rate) + '%';
						}

					} else if (pr_tax.type == 2) {

						pr_tax_val 	= pr_tax.rate;
						pr_tax_rate = pr_tax.rate;

					}
					product_tax += pr_tax_val * item_qty;
				}
			}

			item_price = item_tax_method == 0 ? parseFloat(unit_price-pr_tax_val) : parseFloat(unit_price);
			iprice = item_tax_method == 0 ? parseFloat(real_unit_price-pr_tax_val) : parseFloat(real_unit_price);

			unit_price = parseFloat(unit_price + item_discount);
			
			var sel_opt = '';
			var qty_rec = item_qty;
			
			if(item.options) {
				$.each(item.options, function () {
					if(this.id == item_option) {
						if(site.settings.attributes){
							sel_opt = this.name;
						}
						qty_rec = item_qty * this.qty_unit;
					}
				});
			}
	
			var subtotal = (parseFloat(item_price) * parseFloat(item_qty)) + parseFloat((pr_tax_val) * item_qty);
			
			var row_no = (new Date).getTime();
			var newTr = $('<tr id="row_' + row_no + '" class="row_' + item_id + '" data-item-id="' + item_id + '" sp="'+sep+'"></tr>');
			tr_html ='<td class="text-center"><span class="text-center">#'+no+'</span><input type="hidden" class="count" value="' + item_id + '"></td>';
			
			tr_html += '<input name="price_id[]" type="hidden" id="price_id_' + row_no + '" value="' + price_id + '">';
			
			if(site.settings.show_code == 1 && site.settings.separate_code == 1) {
				tr_html+='<td class="text-left"><span class="text-left">'+ (digital_id?digital_code:item_code) +'</span></td>';
				tr_html += '<td><input name="digital_id[]" type="hidden" class="did" value="' + digital_id + '"><input name="product_id[]" type="hidden" class="rid" value="' + product_id + '"><input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '"><input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '"><input name="product_name[]" type="hidden" class="rname" value="' + item_name + '"><input name="piece[]" type="hidden" class="piece" value="' + piece + '"><input name="wpiece[]" type="hidden" class="wpiece" value="' + wpiece + '"><input name="product_option[]" type="hidden" class="roption" value="' + item_option + '"><input name="group_price_id[]" type="hidden" class="group_price_id" value="' + group_price_id + '"><input name="product_note[]" type="hidden" class="rnote" value="' + pn + '"><span class="sname" id="name_' + row_no + '">' + ((item_promotion == 1 && (current_date >= start_date && current_date <= end_date)) ? '<i class="fa fa-check-circle"></i> ' : '') + (digital_id?digital_name:item_name) +(sel_opt != '' ? ' ('+sel_opt+')' : '') + (pn != '' ? ' (<span id="get_not">' + pn + '</span>)' : '') + '</span> <i class="pull-right fa fa-edit tip pointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
			}
			if(site.settings.show_code == 1 && site.settings.separate_code == 0) {
				tr_html += '<td><input name="digital_id[]" type="hidden" class="did" value="' + digital_id + '"><input name="product_id[]" type="hidden" class="rid" value="' + product_id + '"><input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '"><input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '"><input name="product_name[]" type="hidden" class="rname" value="' + item_name + '"><input name="piece[]" type="hidden" class="piece" value="' + piece + '"><input name="wpiece[]" type="hidden" class="wpiece" value="' + wpiece + '"><input name="product_option[]" type="hidden" class="roption" value="' + item_option + '"><input name="group_price_id[]" type="hidden" class="group_price_id" value="' + group_price_id + '"><input name="product_note[]" type="hidden" class="rnote" value="' + pn + '"><span class="sname" id="name_' + row_no + '">' + ((item_promotion == 1 && (current_date >= start_date && current_date <= end_date)) ? '<i class="fa fa-check-circle"></i> ' : '') + (digital_id?digital_name:item_name) + ' (' + (digital_id?digital_code:item_code) + ')'+(sel_opt != '' ? ' ('+sel_opt+')' : '') + (pn != '' ? ' (<span id="get_not">' + pn + '</span>)' : '') + '</span> <i class="pull-right fa fa-edit tip pointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
			}
			if(site.settings.show_code == 0) {
				tr_html += '<td><input name="digital_id[]" type="hidden" class="did" value="' + digital_id + '"><input name="product_id[]" type="hidden" class="rid" value="' + product_id + '"><input name="product_type[]" type="hidden" class="rtype" value="' + item_type + '"><input name="product_code[]" type="hidden" class="rcode" value="' + item_code + '"><input name="product_name[]" type="hidden" class="rname" value="' + item_name + '"><input name="piece[]" type="hidden" class="piece" value="' + piece + '"><input name="wpiece[]" type="hidden" class="wpiece" value="' + wpiece + '"><input name="product_option[]" type="hidden" class="roption" value="' + item_option + '"><input name="group_price_id[]" type="hidden" class="group_price_id" value="' + group_price_id + '"><input name="product_note[]" type="hidden" class="rnote" value="' + pn + '"><span class="sname" id="name_' + row_no + '">' + ((item_promotion == 1 && (current_date >= start_date && current_date <= end_date)) ? '<i class="fa fa-check-circle"></i> ' : '') + (digital_id?digital_name:item_name) +(sel_opt != '' ? ' ('+sel_opt+')' : '') + (pn != '' ? ' (<span id="get_not">' + pn + '</span>)' : '') + '</span> <i class="pull-right fa fa-edit tip pointer edit" id="' + row_no + '" data-item="' + item_id + '" title="Edit" style="cursor:pointer;"></i></td>';
			}
			/*
			if(site.settings.product_serial == 1){
				if(sep == ""){
					//$('#add_sale').removeAttr('disabled');
					$('#before_sub').removeAttr('disabled');
				}else{
					if(item_serial == ''){
						//$('#add_sale').attr('disabled', 'disabled');
						$('#before_sub').attr('disabled', 'disabled');
					}else{
						if(item_serial == sep){
							//$('#add_sale').removeAttr('disabled');
							$('#before_sub').removeAttr('disabled');
						}
						else{
							alert('wrong serial number');
							$('#before_sub').attr('disabled', 'disabled');
						}
					}
				}
			}
			*/
			if (site.settings.product_serial == 1) {
				if(item_type == 'service'){
					tr_html += '<td class="text-right"></td>';
				}else{
					tr_html += '<td class="text-right"><input class="form-control input-sm rserial" name="serial[]" type="text" id="serial_' + row_no + '" value="'+item_serial+'"></td>';
				}
			}
			if (item_promotion == 1 && (current_date >= start_date && current_date <= end_date)){
				tr_html += '<td class="text-right"><input class="form-control input-sm text-right rprice" name="net_price[]" type="hidden" id="price_' + row_no + '" value="' + real_unit_price + '"><input class="ruprice" name="unit_price[]" type="hidden" value="' + unit_price + '"><input class="realuprice" name="real_unit_price[]" type="hidden" value="' + real_unit_price + '"><span class="text-right sprice" id="sprice_' + row_no + '">' + formatMoney(unit_price) + '</span></td>';
			}else{
				if (owner || admin || sale_order_price) {
					tr_html += '<td class="text-right"><input class="form-control input-sm text-right rprice" name="net_price[]" type="hidden" id="price_' + row_no + '" value="' + item_price + '"><input class="ruprice" name="unit_price[]" type="hidden" value="' + unit_price + '"><input class="realuprice" name="real_unit_price[]" type="hidden" value="' + real_unit_price + '"><span class="text-right spricesprice" id="sprice_' + row_no + '">' + formatMoney(unit_price) + '</span></td>';
				} else {
					tr_html += '<input class="form-control input-sm text-right rprice" name="net_price[]" type="hidden" id="price_' + row_no + '" value="' + item_price + '"><input class="ruprice" name="unit_price[]" type="hidden" value="' + unit_price + '"><input class="realuprice" name="real_unit_price[]" type="hidden" value="' + real_unit_price + '"><span class="text-right spricesprice" id="sprice_' + row_no + '">' + formatMoney(unit_price) + '</span>';
				}
			}
			tr_html += '<input class="default_price" name="default_price[]" type="hidden" value="' + default_price + '">';
			
			tr_html += '<td><input class="form-control text-center rquantity" name="quantity[]" type="text" value="' + formatDecimal(item_qty) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '" onClick="this.select();"></td>';
			
			tr_html += '<input class="form-control text-center rquantity" name="quantity_received[]" type="hidden" value="' + formatDecimal(item_qty_received) + '" data-id="' + row_no + '" data-item="' + item_id + '" id="quantity_' + row_no + '">';
			
			tr_html += '<td class="text-right"><input type="hidden" name="qty_rec[]" class="qty_rec" id="qty_rec_' + row_no + '" value="' + qty_rec + '" /><input type="hidden" name="psoqty[]" class="psoqty" id="psoqty_' + row_no + '" value="' + psoqty + '" /><input type="hidden" name="qty_oh[]" class="qty_oh" id="qty_oh_' + row_no + '" value="' + item_qoh + '" /><span class="qoh">'+ formatDecimal(item.row.qoh ? item.row.qoh : 0) +'</span></td>';
			
			if (site.settings.product_discount == 1) {
				tr_html += '<td class="text-right"><input class="form-control input-sm rdiscount" name="product_discount[]" type="hidden" id="discount_' + row_no + '" value="' + item_ds + '"><span class="text-right sdiscount text-danger" id="sdiscount_' + row_no + '">' + formatMoney(item_discount * item_qty) + '</span></td>';
			}
			if (site.settings.tax1 == 1) {
				tr_html += '<td class="text-right"><input class="form-control input-sm text-right rproduct_tax" name="product_tax[]" type="hidden" id="product_tax_' + row_no + '" value="' + pr_tax.id + '"><span class="text-right sproduct_tax" id="sproduct_tax_' + row_no + '">' + (parseFloat(pr_tax_rate) != 0 ? '(' + pr_tax_rate + ')' : '') + ' ' + formatMoney(pr_tax_val*item_qty) + '</span></td>';
			}
			
			tr_html += '<td class="text-right"><span class="text-right ssubtotal" id="subtotal_' + row_no + '">' + formatMoney(subtotal) + '</span></td>';
			
			tr_html += '<td class="text-center"><i class="fa fa-times tip pointer sldel" id="' + row_no + '" title="Remove" style="cursor:pointer;" ids="'+ product_id +'" qty="'+item_qty+'"></i></td>';
			newTr.html(tr_html);
			newTr.prependTo("#slTable");
			// total += formatDecimal(item_price * item_qty);
			if (item_promotion == 1 && (current_date >= start_date && current_date <= end_date)){
				//total += formatDecimal((((parseFloat(real_unit_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty))) - item_discount);
			}else{
				//total += formatDecimal((((parseFloat(item_price) + parseFloat(pr_tax_val)) * parseFloat(item_qty)) - item_discount), 4);
			}
			
			total+=subtotal;
			count += parseFloat(item_qty);
			an++;

			no++;
		});

		var col = 2;
		if (owner || admin || sale_order_price) { col++; }
        if (site.settings.product_serial == 1) { col++; }
		if (site.settings.show_code == 1 && site.settings.separate_code == 1) { col++; }
		var tfoot = '<tr id="tfoot" class="tfoot active"><th colspan="'+col+'">Total</th><th class="text-center">' + formatNumber(parseFloat(count) - 1) + '</th>';
		tfoot += '<th></th>';
		if (site.settings.product_discount == 1) {
			tfoot += '<th class="text-right">'+formatMoney(product_discount)+'</th>';
		}
		if (site.settings.tax1 == 1) {
			tfoot += '<th class="text-right">'+formatMoney(product_tax)+'</th>';
		}
		
		tfoot += '<th class="text-right"><input type="hidden" name="total_balance" id="total_balance" class="total_balance" value="'+total+'" />'+formatMoney(total)+'</th><th class="text-center"><i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th></tr>';
		
		$('#slTable tfoot').html(tfoot);

        total = formatDecimal(total);
		// Order level discount calculations
		if (sldiscount = __getItem('sldiscount')) {
			var ds = sldiscount;
			if (ds.indexOf("%") !== -1) {
				var pds = ds.split("%");
				if (!isNaN(pds[0])) {
					order_discount = parseFloat(((total) * parseFloat(pds[0])) / 100);
				} else {
					order_discount = parseFloat(((total) * parseFloat(ds)) / 100);
				}
			} else {
				order_discount = parseFloat(((total) * parseFloat(ds)) / 100);
			}
			//total_discount += parseFloat(order_discount);
		}

        // Order level tax calculations
		if (site.settings.tax2 != 0) {
			if (sltax2 = __getItem('sltax2')) {
				$.each(tax_rates, function () {
					if (this.id == sltax2) {
						if (this.type == 2) {
							invoice_tax = parseFloat(this.rate);
						}
						if (this.type == 1) {
							
							
							
							invoice_tax = parseFloat(((total - order_discount + shipping) * this.rate) / 100);
						}
					}
				});
			}
		}

		total_discount = parseFloat(order_discount + product_discount);
		// Totals calculations after item addition
		var gtotal = parseFloat(((total + formatDecimal(invoice_tax) - order_discount) + shipping));
		$('#total').text(formatMoney(total));
		$('#titems').text((an - 1) + ' (' + formatNumber(parseFloat(count) - 1) + ')');
		$('#total_items').val((parseFloat(count) - 1));
		//$('#tds').text('('+formatMoney(product_discount)+'+'+formatMoney(order_discount)+')'+formatMoney(total_discount));
		$('#tds').text(formatMoney(order_discount));
		if (site.settings.tax2 != 0) {
			$('#ttax2').text(formatDecimal(invoice_tax));
		}
		$('#tship').text(formatMoney(shipping));
		$('#gtotal').text(formatMoney(gtotal));
		var pas = $('#slpayment_status').val();
		if(pas == 'paid'){
			$('#amount_1').val(formatDecimal(gtotal));
		}
		if (an > site.settings.bc_fix && site.settings.bc_fix != 0) {
			//This Link of code is animate the screen when too products select.
			//$("html, body").animate({scrollTop: $('#slTable').offset().top - 150}, 500);
			//$(window).scrollTop($(window).scrollTop() + 1);
		}
		if (count > 1) {
			$('#slcustomer2').select2("readonly", true);
			$('#slcustomer').select2("readonly", true);
			$('#slwarehouse').select2("readonly", true);
			$('#slbiller').select2("readonly", true);
		}
		//audio_success.play();
	}
}
/*===============================================end local updated=====================================*/
/* -----------------------------
 * Add Sale Order Item Function
 * @param {json} item
 * @returns {Boolean}
 ---------------------------- */
$(document).on('change','#piece,#wpiece',function(){
	var piece  = $('#piece').val()-0;
	var wpiece = $("#wpiece").val()-0;
	if(Number(piece) && Number(wpiece)) {
		var total  = (piece*wpiece);
		$("#pquantity").val(formatDecimal(total)).trigger("change");
		$("#pnote").val(piece+" x "+wpiece);
	}else {
		$("#pnote").val('');
	}
});
function add_invoice_item(item) {

	if (count == 1) {
		sloitems = {};
	
		if ($('#slwarehouse').val() && $('#slcustomer').val()) {
			$('#slcustomer').select2("readonly", true);
			$('#slwarehouse').select2("readonly", true);
		} else {
			bootbox.alert(lang.select_above);
			item = null;
			return;
		}
	}
	if (item == null) {
		return;
	}
	
	var rounded = item.id;
	$( ".rid" ).each(function() {
		var rid = $(this).val();
		row     = $(this).closest('tr');
		var opt = row.find('.roption').val();
		if ((parseFloat(rid) === parseFloat(item.item_id) && parseFloat(opt) === parseFloat(item.row.option)) || (parseFloat(rid) === parseFloat(item.item_id) && item.row.option === false) ) {
			rounded = row.find('.count').val();
		}
	});
	
    var item_id = site.settings.item_addition == 1 ? rounded : item.id;
	//var item_id = site.settings.item_addition == 1 ? item.item_id : item.id;
	if (sloitems[item_id]) {
		sloitems[item_id].row.qty = parseFloat(sloitems[item_id].row.qty) + 1;
	} else {
		sloitems[item_id] = item;
	}
	
	//sloitems[makeup_cost] = 0;

	__setItem('sloitems', JSON.stringify(sloitems));
	loadItems();
	return true;
}

if (typeof (Storage) === "undefined") {
	$(window).bind('beforeunload', function (e) {
		if (count > 1) {
			var message = "You will loss data!";
			return message;
		}
	});
}
