<?= form_open('system_settings/category_actions', 'id="action-form"') ?>
<div class="box">
    <div class="box-header">
        <h2 class="blue"><i class="fa-fw fa fa-folder-open"></i><?= lang('using_stock_desc'); ?></h2>

        <div class="box-icon">
            <ul class="btn-tasks">
                <li class="dropdown">
                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                        <i class="icon fa fa-tasks tip" data-placement="left" title="<?= lang("actions") ?>"></i>
                    </a>
                    <ul class="dropdown-menu pull-right tasks-menus" role="menu" aria-labelledby="dLabel">
                        <li>
                            <a href="<?php echo site_url('system_settings/add_using_stock_desc/'.$parent_id); ?>" data-toggle="modal" data-target="#myModal">
                                <i class="fa fa-plus"></i> <?= lang('add_desc') ?>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="excel" data-action="export_excel">
                                <i class="fa fa-file-excel-o"></i> <?= lang('export_to_excel') ?>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="pdf" data-action="export_pdf">
                                <i class="fa fa-file-pdf-o"></i> <?= lang('export_to_pdf') ?>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <div class="box-content">
        <div class="row">
            <div class="col-lg-12">
                <p class="introtext"><?= lang('list_results'); ?></p>
                <div class="table-responsive">
                    <table id="CategoryTable" class="table table-bordered table-hover table-striped">
                        <thead>
                            <tr>
                                <th  style="min-width:30px; width: 30px; text-align: center;">
                                    <input type="checkbox" name="checkAll" id="checkAll" />
                                   
                                </th>
                                <th><?= $this->lang->line("desc_code"); ?></th>
                                <th><?= $this->lang->line("desc_name"); ?></th>
                                <th style="width:100px;"><?= $this->lang->line("actions"); ?></th>
                            </tr>
                        </thead>
                        <tbody>
							<?php
							$this->db->select("position.*")
							->from("position");
							$q = $this->db->get();
							$g = 1;
							foreach (($q->result()) as $row){
								
								?>
								<tr>
                                <th style="min-width:30px; width: 30px; text-align: center;">
                                    <input class="check_row" type="checkbox" name="check[]" value="<?= $row->id; ?>" />
                                </th>
                               <td><?=$row->code?></td>
							    <td><?=$row->name?></td>
								
								<td>
								<div class="text-center">
								
								<a href="<?= site_url('system_settings/edit_using_stock_desc/'.$row->id);?>" data-toggle='modal' data-target='#myModal' class='tip' title='<?= lang("edit_desc")?>'><i class="fa fa-edit"></i></a>

								<a class="conf" href="<?= site_url('system_settings/delete_using_stock_desc/'.$row->id);?>"  class='tip' title='<?= lang("delete_desc")?>'> <i class="fa fa-trash-o"></i> </a>
								
								</div>
								
								</td>
                            </tr>
                        <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<div style="display: none;">
    <input type="hidden" name="form_action" value="" id="form_action"/>
    <?= form_submit('submit', 'submit', 'id="action-form-submit"') ?>
</div>
<?= form_close() ?>

<script type="text/javascript">
    $(document).ready(function () {

        $('#checkAll').on('ifChanged', function(){

            if($(this).is(':checked')) {
                $('.check_row').each(function() {
                $(this).iCheck('check');
                });
            }else{
                $('.check_row').each(function() {
                    $(this).iCheck('uncheck');
                });
            }
        });

        $('#delete').click(function (e) {
            e.preventDefault();
            $('#form_action').val($(this).attr('data-action'));
            $('#action-form-submit').trigger('click');
        });

        // $('#excel').click(function (e) {
        //     e.preventDefault();
        //     $('#form_action').val($(this).attr('data-action'));
        //     $('#action-form-submit').trigger('click');
        // });

        // $('#pdf').click(function (e) {
        //     e.preventDefault();
        //     $('#form_action').val($(this).attr('data-action'));
        //     $('#action-form-submit').trigger('click');
        // });
        /*$("#excel").click(function(e){
            e.preventDefault();
            window.location.href = "<?=site_url('System_settings/getCategoryAll/0/xls/')?>";
            return false;
        });
        $('#pdf').click(function (event) {
            event.preventDefault();
            window.location.href = "<?=site_url('System_settings/getCategoryAll/pdf/?v=1'.$v)?>";
            return false;
        });*/

    });
</script>

