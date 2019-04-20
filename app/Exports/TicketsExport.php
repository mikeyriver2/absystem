<?php

namespace App\Exports;

use App\Ticket;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class TicketsExport implements FromView
{
    public function view(): View
    {
        return view('ticket-report', [
            'tickets' => Ticket::all()
        ]);
    }
}
