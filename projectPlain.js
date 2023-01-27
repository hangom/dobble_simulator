
/*
===========================================
    각 장마다 n+1개의 그림이 있는 도블 만들기 
===========================================
n차 사영평면 - 점, 선의 개수 각각 n+1개

- A0를 시작으로 n+1개의 라인
A0, A1, ... , An
A0, An+1, ... , A2n
A0, A2n+1, ..., A3n
...
A0, An^2+1, ... , An^2+n

- A1을 시작으로 n개의 라인
A1, An+1, A2n+1, ... , A(n-1)n+1, An^2+1
A1, An+2, A2n+2, ... , A(n-1)n+2, An^2+2
...
A1, A2n, A2n, ... , An^2, An^2+n

- Am을 시작으로 하는 n개의 라인
    => L1에서 i번째 열을 (m-1)(i-1)만큼 위로 올림
    => Am, L1[1][mod(-(m-1)(i-1))], ... L1[n][mod(-(m-1)(i-1))]
    ...

*/                

function getProjectivePlain(n){

    let result = new Array(); // 결과를 저장할 배열 

    for(let i=0; i<n+1; i++){ //L0 저장
        let sub = [0];
        for(let j=i*n+1; j<(i+1)*n+1; j++){
            sub.push(j);
        }
        result.push(sub);
    }

    for(let i=0; i<n; i++){ //L1 저장
        let sub = [1];
        for(let j=n+1+i; j<=n*n+1+i; j=j+n){
            sub.push(j);
        }
        result.push(sub);
    }

    for(let i=2; i<n+1; i++){ // L2 ~ Ln 저장
        for(let j=0; j<n; j++){
            let sub = [i];
            for(let k=1; k<n+1; k++){
                let itrForL1 = ((i-1)*(k-1)+j)%n+1; // 인덱스 계산
                let point = result[n+itrForL1][k];  // L1에서 인덱스에 해당하는 값 불러오기
                sub.push(point);
            }
            result.push(sub);
        }
    }

    return(result);
}
