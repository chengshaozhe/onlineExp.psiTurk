function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
	return 'AssertException: ' + this.message;
};

function assert(exp, message) {
	if (!exp) {
		throw new AssertException(message);
	}
}

// Mean of booleans (true==1; false==0)
function boolpercent(arr) {
	var count = 0;
	for (var i=0; i<arr.length; i++) {
		if (arr[i]) { count++; } 
	}
	return 100* count / arr.length;
}


// Data storage
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}

Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

function localRecord(data,name){
    var content = JSON.stringify(data);
    var eleLink = document.createElement('a');
    eleLink.download = name + ".json";
    eleLink.style.display = 'none';
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}

function calculatetGirdDistance(grid1,grid2){
    return math.norm([math.abs(grid1[1]-grid2[1]), math.abs(grid1[0]-grid2[0])],1);
}


function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}


function getPermutation(arr) {
    if (arr.length == 1) {
        return [arr];
    }

    var permutation = [];
    for (let i=0; i<arr.length; i++) {
        var firstEle = arr[i];
        var arrClone = arr.slice(0);
        arrClone.splice(i, 1);
        var childPermutation = getPermutation(arrClone);
        for (let j=0; j<childPermutation.length; j++) {
            childPermutation[j].unshift(firstEle);
        }
        permutation = permutation.concat(childPermutation);
    }
    return permutation;
}

