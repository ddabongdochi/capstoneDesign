$(document).ready(function() { // 문서 완전히 로드되고, DOM 준비되면 실행.
    $('#add-memo-form').submit(function(event) { // add-memo-form 폼이 제출될 때 발생하는 이벤트를 처리
        event.preventDefault(); // 폼의 기본 제출 동작을 막음. 이로 인해 페이지가 리로드되지 않음.


        if (typeof player !== 'undefined') {
            var currentTime = player.getCurrentTime(); // 현재 재생 시간 가져옴.
            console.log("currentTime is " + currentTime);
            $('#currenttime').val(currentTime); // 폼에서 hidden으로 설정했던 거 현재 재생 시간으로 설정.
        }

        // Get the form data
        var formData = $(this).serialize(); // 폼 데이터를 직렬화하여 쿼리 문자열 형식으로 변환
        var videoId = $('#add-memo-form [name="video_id"]').val() // 폼 안의 video_id 입력 필드 값 가져옴.
        console.log(videoId);
        var url = '/add-memo/' + encodeURIComponent(videoId) + '/' // AJAX 요청을 보낼 URL을 동적으로 생성

        console.log(videoId)
        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: url, // 요청 보낼 url
            data: formData, // 폼 데이터를 전송
            success: function(response) {
                console.log("Success");
            },
            error: function(xhr, errmsg, err) {
                // Handle error
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
        const addMemoButton = document.getElementById("add-memo"); // id가 "add-memo"인 요소를 찾아 'addMomoButton'에 할당 <<-- 메모 추가 버튼
        const memoListLink = document.querySelector('.nav-tabs .nav-item:nth-child(2) .nav-link'); // 메모 보기 탭 보기
        const memoList = document.getElementById("memo-list"); // id가 "memo-list"인 요소를 찾아 'memolist'에 할당
        const memoItems = document.getElementById("memo-items"); // 메모 목록에 들어가는 아이템이 들어가는 리스트

        // 초를 분으로 변경하는 함수
        function changeSeconds(seconds) {
            if (seconds < 61) {
                return '00:' + addZero(seconds)
            }
            // sec
            var hours = Math.floor(seconds / 3600)
            var mins = Math.floor((seconds - hours * 3600) / 60)
            var secs = Math.floor(seconds % 60)
            return addZero(hours) + ':' + addZero(mins) + ':' + addZero(secs)

            function addZero(num) {
                return ((num < 10) ? '0' : '') + num
            }
        }

        memoListLink.addEventListener("click", function () {
            memoList.style.display = "block";
        });

        // 모달 설정 1 : 창 외부 클릭 시 모달 닫기
        window.addEventListener("click", function (event) {
            const memoModal = document.getElementById("memoModal");
            if (event.target === memoModal) {
                $('#memoModal').modal('hide');
            }
        });

        // 모달 설정 2
        $('#memoModal').on('shown.bs.modal', function () {
            $(document.body).addClass('modal-open');
        });

        // 모달 설정 3 : 모달 숨겨지면 modal-open 클래스 제거.
        $('#memoModal').on('hidden.bs.modal', function () {
            $(document.body).removeClass('modal-open');
        });

        // 모달 설정 4 : 모달 내부 클릭 시에는 모달 닫히지 않음.
        $('#memoModal').on('click', function (event) {
            event.stopPropagation();
        });
    });

    function changeSeconds(seconds) {
        if (seconds < 61) {
            return addZero(Math.floor(seconds / 60)) + ':' + addZero(Math.floor(seconds % 60));
        }

        var hours = Math.floor(seconds / 3600);
        var mins = Math.floor((seconds - hours * 3600) / 60);
        var secs = Math.floor(seconds % 60);
        return (hours > 0 ? addZero(hours) + ':' : '') + addZero(mins) + ':' + addZero(secs);

        function addZero(num) {
            return ((num < 10 && num >= 0) ? '0' : '') + num;
        }
    }

    // 메모 보기 탭
    $(document).ready(function () {
        $("#loadMemo").click(function () { // 클릭 이벤트 추가.
            var videoId = $(this).data("video-id");
            console.log(videoId);
            var url = '/list-memo/' + encodeURIComponent(videoId) + '/';

            $.ajax({
                url: url, // URL to send the request to
                type: 'get', // HTTP method
                dataType: 'json', // 응답 데이터 유형
                success: function (response) {
                    console.log(response);
                    $('#memo-list #dataList').empty(); // Clear the current list

                    // Iterate over the items received from the response
                    $.each(response.items, function (i, item) {
                        if (!$(`#memo-list li[data-id="${item.id}"]`).length) { // 중복 없을 때만 추가
                            // Create the list item element
                            const memoItem = document.createElement("li"); // 새로운 li 요소 생성
                            memoItem.className = "list-group list-group-item"; // Bootstrap 스타일 적용
                            memoItem.setAttribute("data-id", item.id); // 메모 id data_id 속성으로 설정

                            var currentTime = item.current_time; // 메모 현재 시간 가져옴
                            var changedTime = changeSeconds(currentTime); // 보기 좋은 형식으로 변환

                            memoItem.innerHTML = `
                                <div class="row align-items-center">
                                    <div class="col-9">
                                        <div class="d-flex align-items-center">
                                            <div class="btn btn-primary btn-sm btn-fixed-size" style="width: 55px" role="button" onclick="moveTime(${currentTime});">${changedTime}</div>
                                            <div class="text-start ms-2 memo-container memo-text">${item.text}</div>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <button class="btn btn-sm btn-primary editMemo" type="button">수정</button>
                                        <button class="btn btn-sm btn-danger deleteMemo" type="button">삭제</button>
                                    </div>
                                </div>
                            `;

                            $('#memo-list #dataList').append(memoItem); // 생성된 리스트 아이템 메모 목록에 추가
                        }
                    });
                    console.log("Server request successful!");
                },
                error: function (xhr, status, error) {
                    console.error("Server error:", error);
                }
            });
        });
    });

    $(document).on("click", ".editMemo", function () { // editMemo 클래스 가진 버튼 클릭되면 이벤트 핸들러 등록
        const memoItem = $(this).closest("li"); // 가까운 li, memoItem 가져옴
        const memoId = memoItem.data("id"); // memoItem의 data-id 속성값 가져옴
        const memoTextElement = memoItem.find('.memo-text'); // 메모 텍스트 요소 찾음
        const memoText = memoTextElement.text(); // 메모 텍스트 요소 가져옴

        $('#editMemoModal').modal('show'); // 모달 열기
        $('#editMemoText').val(memoText); // 모달 내의 텍스트 영역에 메모 텍스트 설정

        // 저장 버튼 눌렀을 때 이벤트 핸들러
        $('#saveEditedMemo').off().on('click', function () { // off() 메서드를 사용하여 이전에 등록된 모든 클릭 이벤트 핸들러를 제거한 후 새로운 핸들러를 등록
            const editedMemoText = $('#editMemoText').val(); // 수정된 메모 내용 가져옴

            // 수정된 내용 서버에 전송
            $.ajax({
                url: '/edit-memo/',
                type: 'POST',
                data: {
                    memo_id: memoId,
                    text: editedMemoText
                },
                dataType: 'json',
                success: function (response) {
                    console.log("edited memo is " + editedMemoText);
                    console.log("Server response:", response);

                    memoTextElement.text(editedMemoText); // 메모 항목 내의 텍스트를 수정된 내용으로 즉시 업데이트
                    $('#editMemoModal').modal('hide'); // 모달 닫음
                },
                error: function(xhr, status, error){
                    console.error("Server error:", error);
                }
            });
        });
    });







    //삭제
    $(document).on("click", ".deleteMemo", function () {
        const memoItem = $(this).closest("li");
        const memoId = memoItem.data("id");


        $.ajax({
            url: '/delete-memo/',
            type: 'POST',
            data: {
                memo_id: memoId // 삭제할 메모 id
            },
            dataType: 'json',
            success: function (response) {
                console.log("서버 응답:", response);


                memoItem.remove();
            },
            error: function(xhr, status, error){
                console.error("서버 오류:", error);
            }
        });
    });


