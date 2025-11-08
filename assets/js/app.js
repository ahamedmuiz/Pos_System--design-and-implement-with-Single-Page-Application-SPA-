$(document).ready(()=>{
$("#home-page").show

$(".nav-link").click((e) =>{
    e.preventDefault()

    $(".page").hide()

    const target = $(this).data("target")
    console.log(target)
})
})