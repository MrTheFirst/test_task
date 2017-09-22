/*
* Равномерная скорость
* */

var width = 1305,
    height = 372,
    intervals = [
        {
            id: 'line-0',
            d: 'M372.35 277.1C337.35 265.95 224.57 247.8 162.66 280.38',
        },
        {
            id: 'line-1',
            d: 'M522.14 245.87C482.69 275.09 412.69 288.65 373.25 277.43',
        },
        {
            id: 'line-2',
            d: 'M656.48 155.68C634.56 154.19 537.12 235.25 522.86 245.04',
        },
        {
            id: 'line-3',
            d: 'M785.78 155.53C736.95 141.95 693.9 141.88 656.63 155.32',
        },
        {
            id: 'line-4',
            d: 'M896.8 176.32C876.11 181.16 797.7 156.16 785.95 155.68',
        },
        {
            id: 'line-5',
            d: 'M1011.9 117.98C973.18 156.77 934.88 176.2 897.01 176.27',
        },
        {
            id: 'line-6',
            d: 'M1111.63 29.95C1088.6 35.06 1040.62 73.15 1011.84 117.61',
        }
    ],
    circles = [
        {
            x: '152.18',
            y: '268.87',
            index: '0'
        },
        {
            x: '360.86',
            y: '268.87',
            index: '1'
        },
        {
            x: '501.61',
            y: '225.09',
            index: '2'
        },
        {
            x: '640.48',
            y: '136.79',
            index: '3'
        },
        {
            x: '772.56',
            y: '145.85',
            index: '4'
        },
        {
            x: '884.63',
            y: '164.72',
            index: '5'
        },
        {
            x: '986.99',
            y: '98.83',
            index: '6'
        },
        {
            x: '1098.97',
            y: '16.79',
            index: '7'
        }
    ],

    // TODO: создаем svg и задаем размеры
    svg = d3.select('#years-graph').append('svg').attr({
        width: width,
        height: height
    }),

    g = svg.append('g');

intervals.forEach(function (i) {
    g.append('path')
        .attr({
            class: 'line',
            id: i.id,
            d: i.d
        });
});

circles.forEach(function (i) {
    g.append('svg:circle')
        .attr('cx', +i.x + 10)
        .attr('cy', +i.y + 10)
        .attr('r', 11)
        .attr('index', i.index)
        .on('click', function () {
            transition(this);
        });
});

// TODO: создаем лодочку
pointer = g.append('g')
    .attr('transform', 'translate(162, 270)');

label = pointer.append('svg:image')
    .attr({
        'xlink:href': '../images/boat.png',
        x: -30,
        y: -30,
        width: 63,
        height: 41
    });

var direction = -1,
    atLength,
    startPoint = 0;

function transition(e) {

    // TODO: вперед
    if (startPoint < e.getAttribute('index')) {
        direction = -1;

        pointer.transition()
            .ease('linear')
            .duration(1000)
            .attrTween('transform', translateAlong(d3.select('#line-' + startPoint).node(), e.getAttribute('index')));
        startPoint = +startPoint + 1;
    }

    // TODO: Назад
    if (startPoint > e.getAttribute('index')) {
        direction = 1;

        pointer.transition()
            .ease('linear')
            .duration(1000)
            .attrTween('transform', translateAlong(d3.select('#line-' + (+startPoint - 1)).node(), e.getAttribute('index')));
        startPoint = +startPoint - 1;
    }

    if (startPoint != e.getAttribute('index')) {
        setTimeout(function () {
            transition(e)
        }, 1000)
    }
}


function translateAlong(path, i) {
    var l = path.getTotalLength();

    return function (d, i, a) {
        return function (t) {
            atLength = direction === 1 ? (t * l) : (l - (t * l));

            var p1 = path.getPointAtLength(atLength);
            // TODO: fix rotate
            // p2 = path.getPointAtLength((atLength)+direction),
            // angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
            // return 'translate(' + p1.x + ',' + p1.y + ') rotate(' + angle + ')';
            
            return 'translate(' + p1.x + ',' + p1.y + ')';
        }
    }
}




function loadJSON(filePath, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open('GET', filePath, true);
    xhr.send();
}

loadJSON('blacksea.json',
    function (res) {
    console.log('res', res);
    }, function () {
        alert('Ошибка при загрузке данных')
    }
);