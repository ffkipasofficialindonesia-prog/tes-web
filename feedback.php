<?php

$data=json_decode(file_get_contents("php://input"),true);

$webhook="https://discord.com/api/webhooks/1528395222051196959/s3YXI5cWTw66NCCtIvgu4Zp5Ucc7ccSz-AaNuz58a5NAIOFKopTsGVj5uOT7I-ZDgDSp";

$json=[
    "content"=>$data["message"]
];

$options=[
    "http"=>[
        "header"=>"Content-Type: application/json",
        "method"=>"POST",
        "content"=>json_encode($json)
    ]
];

file_get_contents($webhook,false,stream_context_create($options));

echo "✅ Feedback berhasil dikirim!";

?>