var QuadraticEquation = React.createClass({
    componentDidMount: function(){
        self = this

	},

	componentWillMount: function(){
        this.props.model.addres = "/gen/QuadraticEquation/"

		
    	this.props.model.data = checkStorageForDataOrReturnDefault({
			type : [50,50],
			up	: {low:1 ,high:10},
			down: {low:1 ,high:10}
		});

    },

    render: function () {


		var data = this.props.model.data

        return (
			<div className="form">
				<div className="row scol"  rel="Вид" >
					Цели <RangeInput value={data} bind="type" min="0" max="100" /> Дробни
				</div>
				
				<MinMaxInput/>

				<div className="row" rel="Числител" >
					<div className="col" >
						максимум <NumberInput value={data.up} bind="high"/>
					</div>
					<div className="col" >
						минимум <NumberInput value={data.up} bind="low"/>
					</div>
				</div>
				
				<div className="row" rel="Знаменател" >
					<div className="col" >
						максимум <NumberInput value={data.down} bind="high"/>
					</div>
					<div className="col" >
							минимум <NumberInput value={data.down} bind="low"/>
					</div>
				</div>
			</div>
        );
    }
});
