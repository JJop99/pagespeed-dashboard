<?php

namespace App\Http\Controllers;

use App\Mail\HelloEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function sendEmail()
    {
        $data = [
            'subject' => 'Test subject',
            'title' => 'Test mail send from codingdriver.com',
            'body' => 'This is for testing email using mailgun'
        ];

        Mail::send('email-template', $data, function($message) use ($data) {
          $message->to('matteos.aetti@mumbleideas.it')
          ->subject($data['subject']);
        });
       
        dd("Email is Sent.");
    
        /**
         * Check if the email has been sent successfully, or not.
         * Return the appropriate message.
         */
        if (Mail::failures() != 0) {
            return "Email has been sent successfully.";
        }
        return "Oops! There was some error sending the email.";
    }
}