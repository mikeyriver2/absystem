<table>
    <thead>
        <tr>
            <td>Ticket Code</td>
            <td>Ticket Price</td>
            <td>VIP</td>
            <td>Payment Status</td>
            <td>Ticket Redeemed</td>
            <td>Buyer Name</td>
        </tr>
    </thead>
    <tbody>
    @foreach($tickets as $ticket)
        <tr>
            <td>{{$ticket->slug}}</td>
            <td>{{$ticket->ticket_price}}</td>
            <td>{{$ticket->vip ? "True" : "False"}}</td>
            <td>{{$ticket->ticketOrder->paid}}</td>
            <td>{{$ticket->status}}</td>
            <td>{{$ticket->ticketOrder->buyer_first_name}}</td>
        </tr>
    @endforeach 
    </tbody>
</table>