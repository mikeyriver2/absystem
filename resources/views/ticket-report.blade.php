<table>
    <thead>
        <tr>
            <td>Ticket Code</td>
            <td>Ticket Price</td>
            <td>VIP</td>
            <td>Payment Status</td>
            <td>Ticket Redeemed</td>
            <td>Buyer Name</td>
            <td>Buyer Email Address</td>
            <td>Buyer Cell Number</td>
            <td>Buyer Student Number</td>
            <td>Buyer Year Course</td>
        </tr>
    </thead>
    <tbody>
    @foreach($tickets as $ticket)
        <tr>
            <td>{{$ticket->slug}}</td>
            <td>{{$ticket->ticket_price}}</td>
            <td>{{$ticket->vip ? "True" : "False"}}</td>
            <td>{{$ticket->ticketOrder->paid ? "Paid" : "Not Paid"}}</td>
            <td>{{$ticket->status}}</td>
            <td>{{$ticket->ticketOrder->buyer_full_name}}</td>
            <td>{{$ticket->ticketOrder->buyer_email}}</td>
            <td>{{$ticket->ticketOrder->buyer_cell_number}}</td>
            <td>{{$ticket->ticketOrder->student_id_number}}</td>
            <td>{{$ticket->ticketOrder->year_course}}</td>
        </tr>
    @endforeach 
    </tbody>
</table>