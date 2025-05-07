<?php
define('FPDF_FONTPATH','.');
require('../fpdf.html');

$pdf = new FPDF();
$pdf->AddFont('CevicheOne','','CevicheOne-Regular.html');
$pdf->AddPage();
$pdf->SetFont('CevicheOne','',45);
$pdf->Cell(0,10,'Enjoy new fonts with FPDF!');
$pdf->Output();
?>
