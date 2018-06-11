/* 05/04/2018 By Kaoly */

ALTER TABLE `erp_pos_register`
ADD COLUMN `cash_in`  text NULL AFTER `closed_by`,
ADD COLUMN `cash_out`  text NULL AFTER `cash_in`;