/* =========================================== 
 *  Projective Plain을 만들어보자!
 *  보드라이브 <똑똑! 보드게임> 도블편을 위해 만들어진 코드
 *  만든이: 한마리곰
 *  작성일: 2023년 2월~3월
 * 
 *  최초 코드는 빠르게 작성했으나 나중에 보니 코드가 소수에 대해서만 작동해서 
 *  다른 수에 대해서도 작동하도록 수정하려다보니 많은 공부를 하게 되었고, 
 *  결국 n=9 이상의 유한 사영 평면을 구하는 일은 상당한 컴퓨팅 시간이 필요하다는 것을 알게 되었다. 
 *  따라서 이 코드는 제한된 숫자 n에 대해서만 제대로 작동하도록 만들었다.
 *  n이 소수일 때: getProjectivePlainOfPrime(n)
 *  n이 4일 때: getProjectivePlainFromLatinSquare(n)
 *  n이 8, 9일 때: 미리 저장해둔 배열을 불러옴
 *  n이 6, 10일 때: 만들 수 없다는 것이 알려져 있다. 
 * =========================================== 
 */


function getProjectivePlain(n){
    let result = new Array();

    if(n == 4 || n == 8 || n == 9){
        result = getProjectivePlainFromLatinSquare(n);
    }else{
        result = getProjectivePlainOfPrime(n);
    }

    if(checkProjectivePlain(result, n)){
        return result;
    }else{
        return [];
    }
}

// n이 소수인지 판별하는 함수
function isPrime(n){
    if(n == 1) return false;
    for(let i=2; i<n; i++){
        if(n%i == 0) return false;
    }
    return true;
}

/* getProjectivePlainOfPrime(n)
 * 
 * n이 소수일 때, n차 사영 평면을 만드는 함수
 * n이 소수가 아닐 경우에도 뭔가 만들어내지만 사영평면은 아니다. 
 * ---------------------------------------------------------
 *   n차 사영평면 - 점, 선의 개수 각각 n+1개
 *
 *   - A0를 시작으로 n+1개의 라인
 *   A0, A1, ... , An
 *   A0, An+1, ... , A2n
 *   A0, A2n+1, ..., A3n
 *   ...
 *   A0, An^2+1, ... , An^2+n
 *
 *   - A1을 시작으로 n개의 라인
 *   A1, An+1, A2n+1, ... , A(n-1)n+1, An^2+1
 *   A1, An+2, A2n+2, ... , A(n-1)n+2, An^2+2
 *   ...
 *   A1, A2n, A2n, ... , An^2, An^2+n
 *
 *   - Am을 시작으로 하는 n개의 라인
 *       => L1에서 i번째 열을 (m-1)(i-1)만큼 위로 올림
 *       => Am, L1[1][mod(-(m-1)(i-1))], ... L1[n][mod(-(m-1)(i-1))]
 *       ...
 *
*/    
function getProjectivePlainOfPrime(n){ 

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
    //console.log(result);
    //checkProjectivePlain(result, n);
    return(result);
}


// 2개의 배열을 비교해서 같은 원소를 가진 배열을 반환하는 함수
function checkSame(arr1, arr2){
    let count = [];
    for(let i=0; i<arr1.length; i++){
        for(let j=0; j<arr2.length; j++){
            if(arr1[i] == arr2[j]){
                count.push(arr1[i]);
            }
        }
    }
    //console.log(arr1, arr2, count);
    return count;
}


// 만들어진 배열이 사영 평면을 성립하는지 확인하는 함수
function checkProjectivePlain(arr, n){
    
    let matrix = new Array();

    // 먼저 1과 0으로 이루어진 사영 행렬로 변환한다. 
    for(let i=0; i<n*n+n+1; i++){
        matrix.push(new Array());
        for(let j=0; j<n*n+n+1; j++){
            //만약 arr에 j가 있으면 1, 없으면 0
            if(arr[i].includes(j)){
                matrix[i].push(1);
            }else{
                matrix[i].push(0);
            }
        }
    }
    
    // 사영 평면 성립 확인
    for(let i=0; i<n*n+n+1; i++){
        for(let j=i; j<n*n+n+1; j++){
            let good = false;
            for(let k=0; k<n*n+n+1; k++){
                if(matrix[k][i] == 1 && matrix[k][j] == 1){
                    good = true;
                    break;
                }
            }
            if(!good){
                //console.log(i, j, "error");
                return false;
            }
        }
    }
    return true;

}

// Latin Square에서 사영 평면을 만드는 함수
function getProjectivePlainFromLatinSquare(n){
    let latin = getLatinArray(n);
    let result = new Array();

    for(let i=0; i<n+1; i++){ //1행 ~ n+1행 저장
        let sub = [0];
        for(let j=i*n+1; j<(i+1)*n+1; j++){
            sub.push(j);
        }
        result.push(sub);
    }

    for(let i=0; i<n; i++){ //n+2행 ~ 2n+1행 저장
        let sub = [1];
        for(let j=n+1+i; j<=n*n+1+i; j=j+n){
            sub.push(j);
        }
        result.push(sub);
    }
    
    for(let i=0; i<latin.length; i++){ // 나머지 행 저장
        let sub = [Math.floor(i/n)+2];

        for(let j=0;j<n;j++){
            sub.push(n + j*n + latin[i][j]);
        }
        result.push(sub);
    }
    //checkProjectivePlain(result, n);
    return result;
}


/*  getLatinArray(n)
 *  n*n 배열 n-1개를 만들고 그 안에 다음과 같은 조건으로 값을 넣는 함수
 *  Latin Square는 각 행과 열에 1부터 n까지의 숫자가 한 번씩만 나타나는 배열을 말한다.
 *  이 함수는 Latin Square를 만족하는 배열을 만들어 반환한다.
 *  Latin Square를 만족하는 배열을 만들기 위해 다음과 같은 조건을 만족한다.
 *  
 *  1. 각 배열의 가로줄에는 각각 1, 2, 3, ... , n이 한 번씩 들어간다.
 *  2. 각 배열의 세로줄에는 각각 1, 2, 3, ... , n이 한 번씩 들어간다. 
 *  3. 배열 모두에 대해 임의의 두 행을 선택했을 때 그 두 행의 값이 같은 행이 존재하지 않는다.
 *  4. 배열 모두에 대해 임의의 두 행을 선택하고, 그것을 a, b 라고 했을 때, a와 b에서 임의의 두 열을 선택했을 때 그 두 열의 값이 같은 열이 존재하지 않는다.
 *  5. 배열 모두에 대해 임의의 두 열에 대해 행별로 살펴봤을 때 1, 2, 3, ... , n로 조합할 수 있는 모든 조합이 존재한다. 
 *  
 *  Latin Square 배열을 만들 수 있다면 그것으로 Finate Projective Plane을 만들 수 있다.
 *  그 방법에 대해서는 아래 문서들을 참고했다. 
 *  https://purl.pt/2228
 *  https://www.sciencedirect.com/science/article/pii/0012365X9190280F
 * 
 *  하지만, 여기에 짜놓은 알고리즘으로는 O(n^n³)이라는 어마어마한 복잡도를 가지기 때문에 n이 7 이상이 되면 실행이 불가능해진다. 
 *  운 좋게도 n=8일 때는 결과가 빠르게 나왔지만, n=9일 때는 일주일을 돌려도 전체 연산의 1/1000도 돌지 않았다.
 *  여기에는 n=8, n=9일 때의 배열을 직접 입력해놓은 것이 있으니 n=8, n=9일 때는 이 함수를 사용하지 않고 직접 배열을 사용할 것이다.
 *  n=9일 때의 배열은 아래의 아티클을 참고했다. 
 *  https://www.ams.org/journals/mcom/1959-13-068/S0025-5718-1959-0107208-8/S0025-5718-1959-0107208-8.pdf
*/

const latin_8 = [ // n=8일 때의 Latin Square 배열
    [1,2,3,4,5,6,7,8],
    [2,1,4,3,6,5,8,7],
    [3,4,1,2,7,8,5,6],
    [4,3,2,1,8,7,6,5],
    [5,6,7,8,1,2,3,4],
    [6,5,8,7,2,1,4,3],
    [7,8,5,6,3,4,1,2],
    [8,7,6,5,4,3,2,1],

    [1,3,5,7,4,2,8,6],
    [2,4,6,8,3,1,7,5],
    [3,1,7,5,2,4,6,8],
    [4,2,8,6,1,3,5,7],
    [5,7,1,3,8,6,4,2],
    [6,8,2,4,7,5,3,1],
    [7,5,3,1,6,8,2,4],
    [8,6,4,2,5,7,1,3],

    [1,4,7,6,8,5,2,3],
    [2,3,8,5,7,6,1,4],
    [3,2,5,8,6,7,4,1],
    [4,1,6,7,5,8,3,2],
    [5,8,3,2,4,1,6,7],
    [6,7,4,1,3,2,5,8],
    [7,6,1,4,2,3,8,5],
    [8,5,2,3,1,4,7,6],

    [1,5,4,8,7,3,6,2],
    [2,6,3,7,8,4,5,1],
    [3,7,2,6,5,1,8,4],
    [4,8,1,5,6,2,7,3],
    [5,1,8,4,3,7,2,6],
    [6,2,7,3,4,8,1,5],
    [7,3,6,2,1,5,4,8],
    [8,4,5,1,2,6,3,7],

    [1,6,2,5,3,8,4,7],
    [2,5,1,6,4,7,3,8],
    [3,8,4,7,1,6,2,5],
    [4,7,3,8,2,5,1,6],
    [5,2,6,1,7,4,8,3],
    [6,1,5,2,8,3,7,4],
    [7,4,8,3,5,2,6,1],
    [8,3,7,4,6,1,5,2],

    [1,7,8,2,6,4,3,5],
    [2,8,7,1,5,3,4,6],
    [3,5,6,4,8,2,1,7],
    [4,6,5,3,7,1,2,8],
    [5,3,4,6,2,8,7,1],
    [6,4,3,5,1,7,8,2],
    [7,1,2,8,4,6,5,3],
    [8,2,1,7,3,5,6,4],

    [1,8,6,3,2,7,5,4],
    [2,7,5,4,1,8,6,3],
    [3,6,8,1,4,5,7,2],
    [4,5,7,2,3,6,8,1],
    [5,4,2,7,6,3,1,8],
    [6,3,1,8,5,4,2,7],
    [7,2,4,5,8,1,3,6],
    [8,1,3,6,7,2,4,5]];

const latin_9 = [ // n=9일 때의 Latin Square 배열
    [1,2,3,4,5,6,7,8,9], 
    [2,3,1,5,6,4,8,9,7], 
    [3,1,2,6,4,5,9,7,8], 
    [4,5,6,7,8,9,1,2,3], 
    [5,6,4,8,9,7,2,3,1], 
    [6,4,5,9,7,8,3,1,2], 
    [7,8,9,1,2,3,4,5,6], 
    [8,9,7,2,3,1,5,6,4], 
    [9,7,8,3,1,2,6,4,5], 
    
    [1,3,2,8,7,9,6,5,4], 
    [2,1,3,9,8,7,4,6,5], 
    [3,2,1,7,9,8,5,4,6], 
    [4,6,5,3,2,1,8,7,9], 
    [5,4,6,1,3,2,9,8,7], 
    [6,5,4,2,1,3,7,9,8], 
    [7,9,8,6,5,4,2,1,3], 
    [8,7,9,4,6,5,3,2,1], 
    [9,8,7,5,4,6,1,3,2], 
    
    [1,4,7,3,8,5,2,9,6], 
    [2,7,5,6,9,3,1,8,4], 
    [3,9,4,1,7,6,8,2,5], 
    [4,1,9,2,5,8,6,3,7], 
    [5,8,2,9,6,1,7,4,3], 
    [6,2,8,5,3,9,4,7,1], 
    [7,5,1,8,4,2,3,6,9], 
    [8,6,3,7,1,4,9,5,2], 
    [9,3,6,4,2,7,5,1,8], 
    
    [1,5,9,6,3,7,8,4,2], 
    [2,9,6,3,4,8,7,5,1], 
    [3,8,5,4,1,9,2,6,7], 
    [4,2,7,8,6,3,9,1,5], 
    [5,1,8,7,2,6,3,9,4], 
    [6,7,2,1,8,4,5,3,9], 
    [7,4,3,5,9,1,6,2,8], 
    [8,3,4,9,5,2,1,7,6], 
    [9,6,1,2,7,5,4,8,3], 
    
    [1,6,8,9,4,3,5,2,7], 
    [2,8,4,7,3,5,6,1,9], 
    [3,7,6,8,5,1,4,9,2], 
    [4,9,2,5,1,7,3,8,6], 
    [5,2,9,3,7,4,1,6,8], 
    [6,1,7,4,9,2,8,5,3], 
    [7,3,5,2,8,6,9,4,1], 
    [8,4,1,6,2,9,7,3,5], 
    [9,5,3,1,6,8,2,7,4], 
    
    [1,7,4,5,2,8,9,6,3], 
    [2,6,7,1,5,9,3,4,8], 
    [3,4,8,2,6,7,1,5,9], 
    [4,8,3,6,7,2,5,9,1], 
    [5,9,1,4,8,3,6,7,2], 
    [6,3,9,7,4,1,2,8,5], 
    [7,2,6,9,1,5,8,3,4], 
    [8,5,2,3,9,6,4,1,7], 
    [9,1,5,8,3,4,7,2,6], 
    
    [1,8,6,2,9,4,3,7,5], 
    [2,5,8,4,7,1,9,3,6], 
    [3,6,9,5,8,2,7,1,4], 
    [4,7,1,9,3,6,2,5,8], 
    [5,3,7,6,1,8,4,2,9], 
    [6,9,3,8,2,5,1,4,7], 
    [7,1,4,3,6,9,5,8,2], 
    [8,2,5,1,4,7,6,9,3], 
    [9,4,2,7,5,3,8,6,1], 
    
    [1,9,5,7,6,2,4,3,8], 
    [2,4,9,8,1,6,5,7,3], 
    [3,5,7,9,2,4,6,8,1], 
    [4,3,8,1,9,5,7,6,2], 
    [5,7,3,2,4,9,8,1,6], 
    [6,8,1,3,5,7,9,2,4], 
    [7,6,2,4,3,8,1,9,5], 
    [8,1,6,5,7,3,2,4,9], 
    [9,2,4,6,8,1,3,5,7], 
    ];

// Projective Plane을 만들기 위한 Latin Square를 만드는 함수, 실제로는 n=4일때만 사용
function getLatinArray(n){
    if(n==8){
        return latin_8;
    }else if(n==9){
        return latin_9;
    }
    let latin = new Array();
    let combinaton = getCombination(n); 
    let rows = n * (n-1);   // 행의 개수

    latin = getLatinSub(latin, combinaton, n); // latin 배열에 조합을 넣는 함수

    //console.log(latin);

    return latin;
}

// getLatinArray 함수의 재귀 함수
function getLatinSub(latin, combination, n){
    let maxRows = n * (n-1);   // 최대 행의 개수
    let currentRows = latin.length; // 현재 행의 개수
    let latinNum = Math.floor(latin.length / n); // 현재 latin 배열의 번호
    let latinSub = latin.slice(latinNum * n); // 현재 latin 배열의 부분 배열
    
    if (currentRows == maxRows){
        return latin;
    }

    for(let i=0; i<combination.length; i++){ // 이번 라틴 블록에 들어갈 수 있는 모든 조합에 대해 반복
        let current = combination[i];
        let check = true;

        for(let j=0; j<latin.length; j++){ // 전체 라틴 블록에 반복되는 패턴이 있는지 확인
            let count = 0;
            for(let k=0; k<n; k++){
                if(current[k] == latin[j][k]){
                    count++;
                }
            }
            if(count > 1){
                check = false;
                break;
            } 
        }

        for(let j=0; j<latinSub.length; j++){ // 현재의 라틴 블록의 같은 컬럼에 같은 숫자가 있는지 확인
            for(let k=0; k<n; k++){
                if(current[k] == latinSub[j][k]){
                    check = false;
                    break;
                }
            }
        }

        if(check){
            let tempLatin = latin.slice();
            let tempCombination = combination.slice();
            tempLatin.push(current);
            tempCombination.splice(i, 1);

            let subSum = getLatinSub(tempLatin, tempCombination, n);
            
            if(subSum != false){
                return subSum;
            }
            
        }

    }
    return false;
}

        
// n개의 자연수로 나올 수 있는 모든 조합을 반환하는 함수
function getCombination(n){
    if(n==1){
        return [[1]];
    }else{
        let result = new Array();
        let sub = getCombination(n-1);
        for(let i=0; i<sub.length; i++){
            for(let j=0; j<n; j++){
                let temp = sub[i].slice();
                temp.splice(j, 0, n);
                result.push(temp);
            }
        }
        for(let i=result.length-1; i>=0; i--){
            result.sort(function(a, b){
                return a[i]-b[i];
            });
        }
        return result;
    }

}






