<script type="text/javascript">
    $(document).ready(function () {
        $('#form').hide();
        <?php if ($this->input->post('customer')) { ?>
        $('#customer').val(<?= $this->input->post('customer') ?>).select2({
            minimumInputLength: 1,
            data: [],
            initSelection: function (element, callback) {
                $.ajax({
                    type: "get", async: false,
                    url: site.base_url + "customers/suggestions/" + $(element).val(),
                    dataType: "json",
                    success: function (data){
                        callback(data.results[0]);
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
            },
            $('#customer').val(<?= $this->input->post('customer') ?>);
        });

        <?php } ?>
        $('.toggle_down').click(function () {
            $("#form").slideDown();
            return false;
        });
        $('.toggle_up').click(function () {
            $("#form").slideUp();
            return false;
        });
		$('.reset').click(function(){
			window.location.reload(true);
		});
    });
</script>
<style>
    tfoot th {
        border-color: #428BCA !important;
    }
</style>
<?php
    echo form_open('reports/usingStockReport_action', 'id="action-form"');
?>
<div class="box">
    <div class="box-header">
        <h2 class="blue"><i class="fa-fw fa fa-heart"></i><?= lang('report_list_using_stock'); ?><?php
            if ($this->input->post('start_date')) {
                echo " From " . $this->input->post('start_date') . " to " . $this->input->post('end_date');
            }
            ?></h2>

        <div class="box-icon">
            <ul class="btn-tasks">
                <li class="dropdown"><a href="#" class="toggle_up tip" title="<?= lang('hide_form') ?>"><i
                            class="icon fa fa-toggle-up"></i></a></li>
                <li class="dropdown"><a href="#" class="toggle_down tip" title="<?= lang('show_form') ?>"><i
                            class="icon fa fa-toggle-down"></i></a></li>
            </ul>
        </div>
        <div class="box-icon">
            <ul class="btn-tasks">
                <li class="dropdown"><a href="#" id="pdf" data-action="export_pdf" class="tip" title="<?= lang('download_pdf') ?>"><i
                            class="icon fa fa-file-pdf-o"></i></a></li>
                <li class="dropdown"><a href="#" id="excel" data-action="export_excel"  class="tip" title="<?= lang('download_xls') ?>"><i
                            class="icon fa fa-file-excel-o"></i></a></li>
                <li class="dropdown"><a href="#" id="image" class="tip" title="<?= lang('save_image') ?>"><i
                            class="icon fa fa-file-picture-o"></i></a></li>
            </ul>
        </div>
		
    </div>
    <div style="display: none;">
        <input type="hidden" name="form_action" value="" id="form_action"/>
        <?= form_submit('performAction', 'performAction', 'id="action-form-submit"') ?>
    </div>
    <?= form_close() ?>
    <div class="box-content">
        <div class="row">
            <div class="col-lg-12">

                <p class="introtext"><?= lang('customize_report'); ?></p>

                <div id="form">

                    <?php echo form_open("reports/list_using_stock_report",'method="GET"'); ?>
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="form-group">
                                <label class="control-label" for="reference_no"><?= lang("reference_no"); ?></label>
                                <?php echo form_input('reference_no', (isset($_GET['reference_no']) ? $_GET['reference_no'] : ""), 'class="form-control tip" id="reference_no"'); ?>
                            </div>
                        </div>
						<div class="col-sm-3">
                            <div class="form-group">
                                <label class="control-label" for="employee"><?= lang("employee"); ?></label>
                                <?php
                                $E[""] = "ALL";
								
                                foreach ($Employee as $emp){
                                    $E[$emp->id] = $emp->username;
                                }
                                echo form_dropdown('employee', $E, (isset($_GET['employee']) ? $_GET['employee'] : ""), 'class="form-control" id="employee" data-placeholder="' . $this->lang->line("select") . " " . $this->lang->line("employee") . '"');
                                ?>
                            </div>
                        </div>
                        <?php if(2){?>
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <?= lang("biller", "biller"); ?>
                                    <?php
                                    $wh[""] = "ALL";
                                    foreach ($billers as $biller) {
                                        $wh[$biller->id] = $biller->code.' / '.$biller->name;
                                    }
                                    echo form_dropdown('biller', $wh, (isset($_GET['biller']) ? $_GET['biller'] : ""), 'class="form-control" id="biller" data-placeholder="' . $this->lang->line("select") . " " . $this->lang->line("biller") . '"');
                                    ?>
                                </div>
                            </div>
                        <?php } ?>
                        <div class="col-sm-3">
                            <div class="form-group">
                                <label class="control-label" for="warehouse"><?= lang("warehouse"); ?></label>
                                <?php
                                $wh[""] = "ALL";
                                foreach ($warehouses as $warehouse) {
                                    $wh[$warehouse->id] = $warehouse->code.' / '.$warehouse->name;
                                }
                                echo form_dropdown('warehouse', $wh, (isset($_GET['warehouse']) ? $_GET['warehouse'] : ""), 'class="form-control" id="warehouse" data-placeholder="' . $this->lang->line("select") . " " . $this->lang->line("warehouse") . '"');
                                ?>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group">
                                <label class="control-label" for="description"><?= lang("description"); ?></label>
                                <?php
                                $desc[""] = "All Description";
                                foreach ($descriptions as $description) {
                                    $desc[$description->id] = $description->name;
                                }
                                echo form_dropdown('description', $desc, (isset($_GET['description']) ? $_GET['description'] : ""), 'class="form-control" id="description" data-placeholder="' . $this->lang->line("select") . " " . $this->lang->line("description") . '"');
                                ?>
                            </div>
                        </div>
						<?php if($this->Settings->product_serial) { ?>
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <?= lang('serial_no', 'serial'); ?>
                                    <?= form_input('serial', '', 'class="form-control tip" id="serial"'); ?>
                                </div>
                            </div>
                        <?php } ?>
                        <div class="col-sm-3">
                            <div class="form-group">
                                <?= lang("start_date", "start_date"); ?>
                                <?php echo form_input('start_date', (isset($_GET['start_date']) ? $_GET['start_date'] : $this->erp->hrsd($start_date)), 'class="form-control datetime" id="start_date"'); ?>
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="form-group">
                                <?= lang("end_date", "end_date"); ?>
                                <?php echo form_input('end_date', (isset($_GET['end_date']) ? $_GET['end_date'] : $this->erp->hrsd($end_date)), 'class="form-control datetime" id="end_date"'); ?>
                            </div>
                        </div>
						
                    </div>
                    <div class="form-group col-lg-1"style="padding-left:0px;">
                        <div
                            class="controls"> <?php echo form_submit('submit_report', $this->lang->line("submit"), 'class="btn btn-primary"'); ?> </div>
                    </div>
					
                    <?php echo form_close(); ?>

                </div>
                <div class="clearfix"></div>

                <div class="table-responsive">
                    <table class="table table-bordered table-condensed table-striped">
						<thead>
							<tr class="info-head">
								<th style="min-width:30px; width: 30px; text-align: center;">
									<input class="checkbox checkth" type="checkbox" name="val" />
								</th>
								<th style="width:200px;" class="center"><?= lang("item"); ?></th>
								<th style="width:150px;"><?= lang("item_description"); ?></th> 
								<th style="width:150px;"><?= lang("quantity"); ?></th>
								<th style="width:150px;"><?= lang("unit"); ?></th>
								<th style="width:150px;"><?= lang("cost"); ?></th>
								<th style="width:150px;"><?= lang("Total"); ?></th>
							</tr>
						</thead>
						<?php  
						if(is_array($using_stock)){
						    $gtotal_qty = 0; $gtotal_cost = 0; $gsubtotal = 0;
						 foreach($using_stock as $stock){
						          $query=$this->db->query("
							         SELECT
										erp_enter_using_stock_items.*, erp_products. NAME AS product_name,
										erp_enter_using_stock_items.unit AS unit_name,
										erp_products.cost,
										erp_position. NAME AS pname,
										erp_position.name AS rdescription,
										erp_product_variants.qty_unit AS variant_qty,
										erp_product_variants.name as var_name
									FROM
										erp_enter_using_stock_items
									LEFT JOIN erp_products ON erp_products. CODE = erp_enter_using_stock_items. CODE
									LEFT JOIN erp_position ON erp_enter_using_stock_items.description = erp_position.id 
									LEFT JOIN erp_reasons ON erp_enter_using_stock_items.reason = erp_reasons.id
									LEFT JOIN erp_product_variants ON erp_enter_using_stock_items.option_id = erp_product_variants.id
									LEFT JOIN erp_expense_categories ON erp_enter_using_stock_items.exp_cate_id = erp_expense_categories.id where erp_enter_using_stock_items.reference_no='{$stock->refno}' 
									 ")->result();

						?>
                        <tbody>
						       <tr class="bold">
							      <td style="min-width:30px; width: 30px; text-align: center;background-color:#E9EBEC">
									<input type="checkbox" name="val[]" class="checkbox multi-select input-xs" value="<?= $stock->id; ?>" />
								  </td>
								  <td colspan="7" style="font-size:14px;background-color:#E9EBEC;color:#265F7B  "><?=$stock->refno ." >> ".$this->erp->hrld($stock->date) ." >> ".$stock->company ." >> ".$stock->warehouse_name ." >> ".$stock->username ?></td>
							       
							   </tr>
							   <?php
                               $tqty = 0; $tcost = 0; $subtotal = 0;
                               foreach($query as $q){
                                   $tqty += $q->qty_use;
                                   $tcost += $q->cost;
                                   $subtotal += $q->cost*$q->qty_use;
							       ?>
							    <tr>
							      <td style="min-width:30px; width: 30px; text-align: center;">
									
								  </td>
								  <td><?=$q->product_name ."(".$q->code .")" ?></td>
								  <td><?=$q->rdescription ?></td>
							      <td class="text-center"><?=$this->erp->formatQuantity($q->qty_use)?></td> 
							      <td class="text-center"><?=!empty($q->var_name)?$q->var_name :$q->unit_name ?></td> 
								  <td class="text-right"><?=$this->erp->formatMoney($q->cost)?></td>
								  <td class="text-right"><?=$this->erp->formatMoney($q->cost*$q->qty_use) ?></td> 
							   </tr>
							   <?php }?>
                            <tr>
                                <td></td>
                                <td><strong><?= lang('total') ?></strong>:</td>
                                <td></td>
                                <td class="text-center"><?= $this->erp->formatQuantity($tqty); ?></td>
                                <td></td>
                                <td class="text-right"><?= $this->erp->formatMoney($tcost); ?></td>
                                <td class="text-right"><?= $this->erp->formatMoney($subtotal); ?></td>
                            </tr>
					    </tbody>
						<?php
                             $gtotal_qty += $tqty;
                             $gtotal_cost += $tcost;
                             $gsubtotal += $subtotal;
						    }
						}
						?>
                        <tfoot>
                            <tr style="background:#428BCA; color:white; font-size:16px !important;">
                                <th></th>
                                <th><strong><?= lang('grand_total') ?></strong>:</th>
                                <th></th>
                                <th class="text-center"><?= $this->erp->formatQuantity($gtotal_qty); ?></th>
                                <th></th>
                                <th class="text-right"><?= $this->erp->formatMoney($gtotal_cost); ?></th>
                                <th class="text-right"><?= $this->erp->formatMoney($gsubtotal); ?></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
				<div class=" text-right">
					<div class="dataTables_paginate paging_bootstrap">
						<?= $pagination; ?>
					</div>
				</div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="<?= $assets ?>js/html2canvas.min.js"></script>